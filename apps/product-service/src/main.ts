import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔍 DEBUG LOG: Print what the app sees
  console.log('------------------------------------------------');
  console.log('👀 DEBUG: DB_HOST =', process.env.DB_HOST);
  console.log('👀 DEBUG: RABBITMQ_URL =', process.env.RABBITMQ_URL);
  console.log('------------------------------------------------');

  app.enableCors();

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'], // Ensure this matches!
      queue: 'inventory_queue',
      queueOptions: { durable: false },
    },
  });

  await app.startAllMicroservices();

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Product Service running on: http://localhost:${port}/${globalPrefix}`);
}
bootstrap();