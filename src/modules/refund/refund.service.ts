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
export class RefundService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly httpBridgeService: HttpBridgeService,
    private readonly kafkaService: KafkaService,
  ) {}

  // 환불 요청은 결제 생성과 다른 권한이 필요하다는 걸 보여주는 예시다.
  // 실제 금융 시스템에서는 환불이 더 엄격한 승인과 감사 절차를 탄다.
  async requestRefund(message: string): Promise<LabResponse> {
    return this.trace(
      'payment.refund.requested',
      '결제 생성과 분리된 환불 권한을 확인하기 위한 작업',
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
    const message = `payment 서비스가 "${action}" 작업을 처리했다. 이유: ${why}. 요청 메시지: ${inputMessage}. DB 시각: ${databaseNow}. Kafka 토픽: ${topic}.`;

    // eslint-disable-next-line no-console
    console.log(`[payment] ${message}`);

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

    await this.httpBridgeService.sendLog(message, action, why, inputMessage);
    await this.httpBridgeService.sendAudit(message, action, why, inputMessage);

    return {
      service: 'payment',
      action,
      message,
      databaseNow,
      kafkaTopic: topic,
    };
  }
}
