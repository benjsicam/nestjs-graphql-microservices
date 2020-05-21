import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'

import { Logger } from 'nestjs-pino'

import { AppModule } from './app.module'

async function main() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  )

  app.useLogger(app.get(Logger))

  return app.listenAsync(process.env.GRAPHQL_PORT)
}

main()
