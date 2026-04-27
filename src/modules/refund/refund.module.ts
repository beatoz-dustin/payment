import { Module } from '@nestjs/common';
import { RefundController } from './refund.controller';
import { RefundService } from './refund.service';

@Module({
  // 환불은 결제와는 별개로 취급해야 권한과 흐름이 분리된다.
  controllers: [RefundController],
  providers: [RefundService],
})
export class RefundModule {}
