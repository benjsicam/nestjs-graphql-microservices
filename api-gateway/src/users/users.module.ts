import { join } from 'path'
import { Module, forwardRef } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { LoggerModule } from 'nestjs-pino'
import { ClientProxyFactory, Transport, ClientGrpcProxy } from '@nestjs/microservices'

import { UsersResolver } from './users.resolver'
import { UtilsModule } from '../utils/utils.module'
import { CommentsModule } from '../comments/comments.module'
import { PostsModule } from '../posts/posts.module'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [ConfigModule, LoggerModule, UtilsModule, forwardRef(() => AuthModule), forwardRef(() => CommentsModule), forwardRef(() => PostsModule)],
  providers: [
    UsersResolver,
    {
      provide: 'UsersServiceClient',
      useFactory: (configService: ConfigService): ClientGrpcProxy => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            url: configService.get<string>('USERS_SVC_URL'),
            package: 'user',
            protoPath: join(__dirname, '../_proto/user.proto'),
            loader: {
              keepCase: true,
              enums: String,
              oneofs: true,
              arrays: true
            }
          }
        })
      },
      inject: [ConfigService]
    }
  ],
  exports: ['UsersServiceClient']
})
export class UsersModule {}
