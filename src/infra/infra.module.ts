import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { HttpBridgeService } from './http-bridge.service';
import { KafkaService } from './kafka.service';

@Global()
@Module({
  // payment 앱은 DB와 Kafka가 살아있는지 시작 시점에 바로 확인한다.
  providers: [DatabaseService, KafkaService, HttpBridgeService],
  exports: [DatabaseService, KafkaService, HttpBridgeService],
})
export class InfraModule {}
