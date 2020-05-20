import { join } from 'path'

import { NestFactory } from '@nestjs/core'
import { Transport } from '@nestjs/microservices'
import { Logger } from 'nestjs-pino'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: `${process.env.GRPC_HOST}:${process.env.GRPC_PORT}`,
      package: 'comment',
      protoPath: join(__dirname, './_proto/comment.proto'),
      loader: {
        keepCase: true,
        enums: String,
        oneofs: true
      }
    }
  })

  app.useLogger(app.get(Logger))

  return app.listenAsync()
}

bootstrap()
