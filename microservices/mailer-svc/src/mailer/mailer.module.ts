import { Module } from '@nestjs/common'
import { LoggerModule } from 'nestjs-pino'
import { MailerModule as MailModule } from '@nestjs-modules/mailer'

import { MailerController } from './mailer.controller'

@Module({
  imports: [LoggerModule, MailModule],
  controllers: [MailerController]
})
export class MailerModule {}
