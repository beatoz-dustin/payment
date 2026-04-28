import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { InfraModule } from './infra/infra.module';
import { PaymentModule } from './modules/payment/payment.module';
import { RefundModule } from './modules/refund/refund.module';
import { AuditProbeModule } from './modules/zero-trust/audit-probe.module';

@Module({
  // payment 앱은 여러 업무 모듈을 조립하는 최상위 컨테이너 역할만 한다.
  // 실제 업무 규칙은 아래의 하위 모듈들에 들어간다.
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    InfraModule,
    PaymentModule,
    RefundModule,
    AuditProbeModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
