import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  // 결제 생성/완료 같은 "결제의 핵심 흐름"을 담는 모듈이다.
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
