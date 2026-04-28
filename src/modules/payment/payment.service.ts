import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../infra/database.service';
import { HttpBridgeService } from '../../infra/http-bridge.service';
import { KafkaService } from '../../infra/kafka.service';

type LabResponse = {
  service: string;
  action: string;
  message: string;
  databaseNow: string;
  kafkaTopic: string;
};

@Injectable()
export class PaymentService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly httpBridgeService: HttpBridgeService,
    private readonly kafkaService: KafkaService,
  ) {}

  // 결제 생성은 payment 도메인의 가장 기본적인 쓰기 작업이다.
  // 이 메서드는 DB를 한번 확인하고 Kafka로 이벤트를 발행해서
  // "이 작업이 실제로 어떤 인프라를 건드리는지"를 눈으로 보이게 만든다.
  async createPayment(message: string): Promise<LabResponse> {
    return this.trace(
      'payment.created',
      '결제 생성을 위한 단독 작업',
      message,
      'payment.events',
    );
  }

  // 결제 완료는 downstream 서비스가 후속 작업을 시작하는 트리거 역할을 한다.
  async completePayment(message: string): Promise<LabResponse> {
    return this.trace(
      'payment.completed',
      '결제 완료 후 송금과 정산이 이어질 수 있도록 하는 후속 작업',
      message,
      'payment.events',
    );
  }

  private async trace(
    action: string,
    why: string,
    inputMessage: string,
    topic: string,
  ): Promise<LabResponse> {
    const databaseNow = await this.databaseService.ping();
    const logMessage = `payment 서비스가 "${action}" 작업을 처리했다. 이유: ${why}. 요청 메시지: ${inputMessage}. DB 시각: ${databaseNow}. Kafka 토픽: ${topic}.`;

    // eslint-disable-next-line no-console
    console.log(`[payment] ${logMessage}`);

    await this.kafkaService.publish(
      topic,
      JSON.stringify({
        service: 'payment',
        action,
        why,
        inputMessage,
        databaseNow,
      }),
    );

    await this.httpBridgeService.sendLog(logMessage, action, why, inputMessage);
    if (action === 'payment.completed') {
      const downstreamMessage = `payment 서비스가 결제 완료를 remittance로 전달하는 이유: ${why}.`;
      const downstreamResponse = await this.httpBridgeService.postService<{
        service: string;
        action: string;
        message: string;
        databaseNow: string;
        kafkaTopic: string;
      }>(
        'REMITTANCE_SERVICE_URL',
        'http://localhost:3002',
        '/remittances/request',
        {
          message: downstreamMessage,
        },
        'payment가 remittance 서비스를 호출함',
      );

      // eslint-disable-next-line no-console
      console.log(
        `[payment] remittance 응답을 받음: ${downstreamResponse.action} / ${downstreamResponse.message}`,
      );
    }

    return {
      service: 'payment',
      action,
      message: logMessage,
      databaseNow,
      kafkaTopic: topic,
    };
  }
}
