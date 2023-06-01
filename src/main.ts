import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    // origin: ['127.0.0.1:3000', 'http://localhost:3000'],
    origin: '*',
    credentials: true,
  });
  await app.listen(8000);
}
bootstrap();
