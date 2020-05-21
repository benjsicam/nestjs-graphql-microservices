import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MailerModule as MailModule } from '@nestjs-modules/mailer'
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter'

import { LoggerModule } from 'nestjs-pino'

import { MailerModule } from './mailer/mailer.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        pinoHttp: {
          safe: true,
          prettyPrint: configService.get<string>('NODE_ENV') !== 'production'
        }
      }),
      inject: [ConfigService]
    }),
    MailModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('SMTP_HOST'),
          port: configService.get<number>('SMTP_PORT'),
          secure: configService.get<boolean>('SMTP_SECURE'),
          auth: {
            user: configService.get<string>('SMTP_USER'),
            pass: configService.get<string>('SMTP_PASS')
          },
          preview: configService.get<string>('NODE_ENV') !== 'production',
          defaults: {
            from: '"No Reply" <no-reply@localhost>'
          },
          template: {
            dir: __dirname + '/templates',
            adapter: new PugAdapter(),
            options: {
              strict: true
            }
          }
        }
      }),
      inject: [ConfigService]
    }),
    MailerModule
  ]
})
export class AppModule {}
