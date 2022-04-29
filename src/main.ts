import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 3000;
  console.log('Port running on: ', port);
  app.enableCors();
  await app.listen(port);
}
bootstrap();
