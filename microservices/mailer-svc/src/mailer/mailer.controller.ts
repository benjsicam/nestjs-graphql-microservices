import { PinoLogger } from 'nestjs-pino'
import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import { MailerService } from '@nestjs-modules/mailer'

import { ISendMailInput, ISendMailPayload } from './mailer.interface'

@Controller()
export class MailerController {
  constructor(private readonly service: MailerService, private readonly logger: PinoLogger) {
    logger.setContext(MailerController.name)
  }

  @GrpcMethod('MailerService', 'send')
  async send(input: ISendMailInput): Promise<ISendMailPayload> {
    const mailInput = {
      ...input,
      data: JSON.parse(Buffer.from(input.data).toString())
    }

    this.logger.info('MailerController#send.call %o', mailInput)

    let subject = ''

    switch (mailInput.template) {
      case 'new-comment':
        subject = 'Notice: New Comment on your Post'
        break
      case 'signup':
        subject = 'Welcome to GraphQL Blog'
        break
      case 'update-email':
        subject = 'Notice: Email Update'
        break
      case 'update-password':
        subject = 'Notice: Password Update'
        break
      default:
        break
    }

    await this.service.sendMail({
      to: mailInput.to,
      subject,
      template: mailInput.template,
      context: mailInput.data
    })

    this.logger.info('MailerController#sent')

    return { isSent: true }
  }
}
