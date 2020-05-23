import { join } from 'path'

import { NestFactory } from '@nestjs/core'
import { Transport, MicroserviceOptions } from '@nestjs/microservices'
import { Logger } from 'nestjs-pino'

import { LoggerService, INestMicroservice } from '@nestjs/common'
import { AppModule } from './app.module'

async function main() {
  const app: INestMicroservice = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: `${process.env.GRPC_HOST}:${process.env.GRPC_PORT}`,
      package: 'comment',
      protoPath: join(__dirname, './_proto/comment.proto'),
      loader: {
        keepCase: true,
        enums: String,
        oneofs: true,
        arrays: true
      }
    }
  })

  app.useLogger(app.get<Logger, LoggerService>(Logger))

  return app.listenAsync()
}

main()
