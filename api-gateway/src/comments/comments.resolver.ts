import { Inject, OnModuleInit, UseGuards } from '@nestjs/common'
import { ClientGrpcProxy } from '@nestjs/microservices'
import { Query, Resolver, Args, Parent, ResolveField, Mutation } from '@nestjs/graphql'

import { isEmpty, merge } from 'lodash'
import { PinoLogger } from 'nestjs-pino'

import { CommentDto } from './comment.dto'
import { ICommentsService } from './comments.interface'
import { IPostsService } from '../posts/posts.interface'
import { IUsersService } from '../users/users.interface'
import { GqlAuthGuard } from '../auth/gql.authguard'
import { CurrentUser } from '../auth/user.decorator'
import { CommentsConnection, Comment, Post, User, CommentPayload, UpdateCommentInput, DeleteCommentPayload } from '../graphql/typings'

import { QueryUtils } from '../utils/query.utils'

@Resolver('Comment')
export class CommentsResolver implements OnModuleInit {
  constructor(
    @Inject('CommentsServiceClient')
    private readonly commentsServiceClient: ClientGrpcProxy,

    @Inject('PostsServiceClient')
    private readonly postsServiceClient: ClientGrpcProxy,

    @Inject('UsersServiceClient')
    private readonly usersServiceClient: ClientGrpcProxy,

    private readonly queryUtils: QueryUtils,

    private readonly logger: PinoLogger
  ) {
    logger.setContext(CommentsResolver.name)
  }

  private commentsService: ICommentsService

  private postsService: IPostsService

  private usersService: IUsersService

  onModuleInit(): void {
    this.commentsService = this.commentsServiceClient.getService<ICommentsService>('CommentsService')
    this.postsService = this.postsServiceClient.getService<IPostsService>('PostsService')
    this.usersService = this.usersServiceClient.getService<IUsersService>('UsersService')
  }

  @Query('comments')
  async getComments(
    @Args('q') q: string,
    @Args('first') first: number,
    @Args('last') last: number,
    @Args('before') before: string,
    @Args('after') after: string,
    @Args('filterBy') filterBy: any,
    @Args('orderBy') orderBy: string
  ): Promise<CommentsConnection> {
    const query = { where: {} }

    if (!isEmpty(q)) merge(query, { where: { text: { _iLike: q } } })

    merge(query, await this.queryUtils.buildQuery(filterBy, orderBy, first, last, before, after))

    return this.commentsService
      .find({
        ...query,
        where: JSON.stringify(query.where)
      })
      .toPromise()
  }

  @Query('commentCount')
  async getCommentCount(@Args('q') q: string, @Args('filterBy') filterBy: any): Promise<number> {
    const query = { where: {} }

    if (!isEmpty(q)) merge(query, { where: { title: { _iLike: q } } })

    merge(query, await this.queryUtils.getFilters(filterBy))

    const { count } = await this.commentsService
      .count({
        ...query,
        where: JSON.stringify(query.where)
      })
      .toPromise()

    return count
  }

  @ResolveField('author')
  async getAuthor(@Parent() comment: CommentDto): Promise<User> {
    return this.usersService
      .findById({
        id: comment.author
      })
      .toPromise()
  }

  @ResolveField('post')
  async getPost(@Parent() comment: CommentDto): Promise<Post> {
    return this.postsService
      .findById({
        id: comment.post
      })
      .toPromise()
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

    return { comment }
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async updateComment(@Args('id') id: string, @Args('data') data: UpdateCommentInput): Promise<CommentPayload> {
    const comment: Comment = await this.commentsService
      .update({
        id,
        data: {
          ...data
        }
      })
      .toPromise()

    return { comment }
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async deleteComment(@Args('id') id: string): Promise<DeleteCommentPayload> {
    return this.commentsService
      .destroy({
        where: JSON.stringify({ id })
      })
      .toPromise()
  }
}
