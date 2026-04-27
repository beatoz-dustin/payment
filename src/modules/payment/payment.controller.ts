import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // 결제 생성:
  // 실제 시스템이라면 결제 금액, 주문번호, 통화, 사용자 식별자 등이 들어가겠지만
  // 지금은 string 하나만 받아서 "결제 이벤트"를 흉내낸다.
  @Post('create')
  async createPayment(
    @Body('message') message: string,
  ): Promise<{
    service: string;
    action: string;
    message: string;
    databaseNow: string;
    kafkaTopic: string;
  }> {
    return this.paymentService.createPayment(message);
  }

  // 결제 완료:
  // payment가 다른 서비스(remittance, settlement)로 넘길 준비가 끝났다는 신호.
  @Post('complete')
  async completePayment(
    @Body('message') message: string,
  ): Promise<{
    service: string;
    action: string;
    message: string;
    databaseNow: string;
    kafkaTopic: string;
  }> {
    return this.paymentService.completePayment(message);
  }
}
