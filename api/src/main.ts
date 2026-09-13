import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:5173',  'http://localhost:8080'], //Former case, frontend is in dev mode (npm run dev, Vue default dev port). Latter case, frontend is in build mode (npm run build)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
