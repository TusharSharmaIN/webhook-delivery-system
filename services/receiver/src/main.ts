import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Receiver (fake webhook subscriber)')
    .setDescription(
      'Simulates a customer endpoint. Verifies HMAC signatures, dedupes via X-Event-Id, ' +
        'and can be toggled to fail/be slow/be down for testing retry behavior.',
    )
    .setVersion('0.1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3002);

  console.log(`🚀 Receiver is running on ${await app.getUrl()}`);
}
bootstrap();