import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.PORT ?? 3001);

  await app.listen(port);
  // Keep it simple for the lab. Each service gets its own port.
  // In Kubernetes this will usually be overridden by the container/service config.
  // eslint-disable-next-line no-console
  console.log(`payment service listening on ${port}`);
}

void bootstrap();
