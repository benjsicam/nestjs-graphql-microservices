import { Inject, OnModuleInit, UseGuards } from '@nestjs/common'
import { ClientGrpcProxy } from '@nestjs/microservices'
import { Resolver, Args, Mutation } from '@nestjs/graphql'

import { Metadata } from 'grpc'
import { PinoLogger } from 'nestjs-pino'
import { PubSub } from 'graphql-subscriptions'

import { CommentDto } from './comment.dto'
import { ICommentsService } from './comments.interface'
import { GqlAuthGuard } from '../auth/gql-auth.guard'
import { CurrentUser } from '../auth/user.decorator'
import { Comment, User, CommentPayload, UpdateCommentInput, DeleteCommentPayload } from '../graphql/typings'

@Resolver()
export class CommentsMutationResolver implements OnModuleInit {
  constructor(
    @Inject('CommentsServiceClient')
    private readonly commentsServiceClient: ClientGrpcProxy,

    @Inject('PubSubService')
    private readonly pubSubService: PubSub,

    private readonly logger: PinoLogger
  ) {
    logger.setContext(CommentsMutationResolver.name)
  }

  private commentsService: ICommentsService

  onModuleInit(): void {
    this.commentsService = this.commentsServiceClient.getService<ICommentsService>('CommentsService')
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async createComment(@CurrentUser() user: User, @Args('data') data: CommentDto): Promise<CommentPayload> {
    const comment: Comment = await this.commentsService
      .create({
        ...data,
        author: user.id
      })
      .toPromise()

    this.pubSubService.publish('commentAdded', comment)

    return { comment }
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async updateComment(@CurrentUser() user: User, @Args('id') id: string, @Args('data') data: UpdateCommentInput): Promise<CommentPayload> {
    const metadata: Metadata = new Metadata()

    metadata.add('user', user.id)

    const comment: Comment = await this.commentsService
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

    return { comment }
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async deleteComment(@CurrentUser() user: User, @Args('id') id: string): Promise<DeleteCommentPayload> {
    return this.commentsService
      .destroy({
        where: JSON.stringify({ id, author: user.id })
      })
      .toPromise()
  }
}
