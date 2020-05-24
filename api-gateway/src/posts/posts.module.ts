import { join } from 'path'
import { Module, forwardRef } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { LoggerModule } from 'nestjs-pino'
import { ClientProxyFactory, Transport, ClientGrpcProxy } from '@nestjs/microservices'

import { PostsTypeResolver } from './posts-type.resolver'
import { PostsQueryResolver } from './posts-query.resolver'
import { PostsMutationResolver } from './posts-mutation.resolver'
import { PostsSubscriptionResolver } from './posts-subscription.resolver'

import { UtilsModule } from '../utils/utils.module'
import { CommentsModule } from '../comments/comments.module'
import { UsersModule } from '../users/users.module'
import { CommonsModule } from '../commons/commons.module'

@Module({
  imports: [ConfigModule, LoggerModule, CommonsModule, UtilsModule, forwardRef(() => CommentsModule), forwardRef(() => UsersModule)],
  providers: [
    PostsTypeResolver,
    PostsQueryResolver,
    PostsMutationResolver,
    PostsSubscriptionResolver,
    {
      provide: 'PostsServiceClient',
      useFactory: (configService: ConfigService): ClientGrpcProxy => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            url: configService.get<string>('POSTS_SVC_URL'),
            package: 'post',
            protoPath: join(__dirname, '../_proto/post.proto'),
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
  exports: ['PostsServiceClient']
})
export class PostsModule {}
