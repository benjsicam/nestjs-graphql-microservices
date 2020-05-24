import { Inject, OnModuleInit } from '@nestjs/common'
import { ClientGrpcProxy } from '@nestjs/microservices'
import { Resolver, Args, Parent, ResolveField } from '@nestjs/graphql'

import { isEmpty, merge } from 'lodash'
import { PinoLogger } from 'nestjs-pino'

import { ICommentsService } from '../comments/comments.interface'
import { IPostsService } from '../posts/posts.interface'
import { CommentsConnection, User, PostsConnection } from '../graphql/typings'

import { QueryUtils } from '../utils/query.utils'

@Resolver('User')
export class UsersTypeResolver implements OnModuleInit {
  constructor(
    @Inject('CommentsServiceClient')
    private readonly commentsServiceClient: ClientGrpcProxy,

    @Inject('PostsServiceClient')
    private readonly postsServiceClient: ClientGrpcProxy,

    private readonly queryUtils: QueryUtils,

    private readonly logger: PinoLogger
  ) {
    logger.setContext(UsersTypeResolver.name)
  }

  private commentsService: ICommentsService

  private postsService: IPostsService

  onModuleInit(): void {
    this.commentsService = this.commentsServiceClient.getService<ICommentsService>('CommentsService')
    this.postsService = this.postsServiceClient.getService<IPostsService>('PostsService')
  }

  @ResolveField('posts')
  async getPosts(
    @Parent() user: User,
    @Args('q') q: string,
    @Args('first') first: number,
    @Args('last') last: number,
    @Args('before') before: string,
    @Args('after') after: string,
    @Args('filterBy') filterBy: any,
    @Args('orderBy') orderBy: string
  ): Promise<PostsConnection> {
    const query = { where: { author: user.id } }

    if (!isEmpty(q)) merge(query, { where: { title: { _iLike: q } } })

    merge(query, await this.queryUtils.buildQuery(filterBy, orderBy, first, last, before, after))

    return this.postsService
      .find({
        ...query,
        where: JSON.stringify(query.where)
      })
      .toPromise()
  }

  @ResolveField('comments')
  async getComments(
    @Parent() user: User,
    @Args('q') q: string,
    @Args('first') first: number,
    @Args('last') last: number,
    @Args('before') before: string,
    @Args('after') after: string,
    @Args('filterBy') filterBy: any,
    @Args('orderBy') orderBy: string
  ): Promise<CommentsConnection> {
    const query = { where: { author: user.id } }

    if (!isEmpty(q)) merge(query, { where: { text: { _iLike: q } } })

    merge(query, await this.queryUtils.buildQuery(filterBy, orderBy, first, last, before, after))

    return this.commentsService
      .find({
        ...query,
        where: JSON.stringify(query.where)
      })
      .toPromise()
  }
}
