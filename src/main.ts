import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.use(cookieParser());
  app.useLogger(app.get(Logger));
  app.enableCors({
    origin: ['http://localhost:8080', 'https://devdrill.hyeonwoo.com'],
    credentials: true,
    exposedHeaders: ['Authorization'],
  });

  console.log('###### ', process.env.OTEL_SERVICE_NAME);
  console.log('###### ', process.env.NODE_OPTIONS);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
