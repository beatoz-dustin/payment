import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot(): string {
    // 루트 응답은 단순한 상태 확인용이다.
    // 실제 기능은 각 도메인 모듈의 controller가 담당한다.
    return 'payment app is running';
  }

  @Get('health')
  getHealth(): { service: string; status: string } {
    return { service: 'payment', status: 'ok' };
  }
}
