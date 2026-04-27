import { Body, Controller, Post } from '@nestjs/common';
import { RefundService } from './refund.service';

@Controller('refunds')
export class RefundController {
  constructor(private readonly refundService: RefundService) {}

  // 환불 요청:
  // 보통 결제 완료 이후에만 허용될 수 있는 별도 규칙을 가진다.
  @Post('request')
  async requestRefund(
    @Body('message') message: string,
  ): Promise<{
    service: string;
    action: string;
    message: string;
    databaseNow: string;
    kafkaTopic: string;
  }> {
    return this.refundService.requestRefund(message);
  }
}
