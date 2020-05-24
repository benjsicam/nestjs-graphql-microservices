import { join } from 'path'
import { Module, forwardRef } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { LoggerModule } from 'nestjs-pino'
import { ClientProxyFactory, Transport, ClientGrpcProxy } from '@nestjs/microservices'

import { CommentsTypeResolver } from './comments-type.resolver'
import { CommentsQueryResolver } from './comments-query.resolver'
import { CommentsMutationResolver } from './comments-mutation.resolver'
import { CommentsSubscriptionResolver } from './comments-subscription.resolver'

import { UtilsModule } from '../utils/utils.module'
import { PostsModule } from '../posts/posts.module'
import { UsersModule } from '../users/users.module'
import { CommonsModule } from '../commons/commons.module'

@Module({
  imports: [ConfigModule, LoggerModule, CommonsModule, UtilsModule, forwardRef(() => PostsModule), forwardRef(() => UsersModule)],
  providers: [
    CommentsTypeResolver,
    CommentsQueryResolver,
    CommentsMutationResolver,
    CommentsSubscriptionResolver,
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
