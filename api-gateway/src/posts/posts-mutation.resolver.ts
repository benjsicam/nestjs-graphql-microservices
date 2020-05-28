import { Inject, OnModuleInit, UseGuards } from '@nestjs/common'
import { ClientGrpcProxy } from '@nestjs/microservices'
import { Resolver, Args, Mutation } from '@nestjs/graphql'

import { Metadata } from 'grpc'
import { PinoLogger } from 'nestjs-pino'
import { PubSub } from 'graphql-subscriptions'

import { IPostsService } from './posts.interface'
import { GqlAuthGuard } from '../auth/gql-auth.guard'
import { CurrentUser } from '../auth/user.decorator'
import { User, PostPayload, UpdatePostInput, DeletePostPayload } from '../graphql/typings'

import { PostDto } from './post.dto'

@Resolver()
export class PostsMutationResolver implements OnModuleInit {
  constructor(
    @Inject('PostsServiceClient')
    private readonly postsServiceClient: ClientGrpcProxy,

    @Inject('PubSubService')
    private readonly pubSubService: PubSub,

    private readonly logger: PinoLogger
  ) {
    logger.setContext(PostsMutationResolver.name)
  }

  private postsService: IPostsService

  onModuleInit(): void {
    this.postsService = this.postsServiceClient.getService<IPostsService>('PostsService')
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async createPost(@CurrentUser() user: User, @Args('data') data: PostDto): Promise<PostPayload> {
    const post = await this.postsService
      .create({
        ...data,
        author: user.id
      })
      .toPromise()

    this.pubSubService.publish('postAdded', post)

    return { post }
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async updatePost(@CurrentUser() user: User, @Args('id') id: string, @Args('data') data: UpdatePostInput): Promise<PostPayload> {
    const metadata: Metadata = new Metadata()

    metadata.add('user', user.id)

    const post = await this.postsService
      .update(
        {
          id,
          data: {
            ...data
          }
        },
        metadata
      )
      .toPromise()

    return { post }
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async deletePost(@CurrentUser() user: User, @Args('id') id: string): Promise<DeletePostPayload> {
    return this.postsService
      .destroy({
        where: JSON.stringify({ id, author: user.id })
      })
      .toPromise()
  }
}
