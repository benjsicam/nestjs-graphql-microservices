import { join } from 'path'
import { Module, forwardRef } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { LoggerModule } from 'nestjs-pino'
import { ClientProxyFactory, Transport, ClientGrpcProxy } from '@nestjs/microservices'

import { CommentsResolver } from './comments.resolver'
import { UtilsModule } from '../utils/utils.module'
import { PostsModule } from '../posts/posts.module'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [ConfigModule, LoggerModule, UtilsModule, forwardRef(() => PostsModule), forwardRef(() => UsersModule)],
  providers: [
    CommentsResolver,
    {
      provide: 'CommentsServiceClient',
      useFactory: (configService: ConfigService): ClientGrpcProxy => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            url: configService.get<string>('COMMENTS_SVC_URL'),
            package: 'comment',
            protoPath: join(__dirname, '../_proto/comment.proto'),
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
  exports: ['CommentsServiceClient']
})
export class CommentsModule {}
