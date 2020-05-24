import { Inject, OnModuleInit } from '@nestjs/common'
import { ClientGrpcProxy } from '@nestjs/microservices'
import { Resolver, Args, Parent, ResolveField } from '@nestjs/graphql'

import { isEmpty, merge } from 'lodash'
import { PinoLogger } from 'nestjs-pino'

import { ICommentsService } from '../comments/comments.interface'
import { IUsersService } from '../users/users.interface'
import { CommentsConnection, Post, User } from '../graphql/typings'

import { QueryUtils } from '../utils/query.utils'
import { PostDto } from './post.dto'

@Resolver('Post')
export class PostsTypeResolver implements OnModuleInit {
  constructor(
    @Inject('CommentsServiceClient')
    private readonly commentsServiceClient: ClientGrpcProxy,

    @Inject('UsersServiceClient')
    private readonly usersServiceClient: ClientGrpcProxy,

    private readonly queryUtils: QueryUtils,

    private readonly logger: PinoLogger
  ) {
    logger.setContext(PostsTypeResolver.name)
  }

  private commentsService: ICommentsService

  private usersService: IUsersService

  onModuleInit(): void {
    this.commentsService = this.commentsServiceClient.getService<ICommentsService>('CommentsService')
    this.usersService = this.usersServiceClient.getService<IUsersService>('UsersService')
  }

  @ResolveField('author')
  async getAuthor(@Parent() post: PostDto): Promise<User> {
    return this.usersService
      .findById({
        id: post.author
      })
      .toPromise()
  }

  @ResolveField('comments')
  async getComments(
    @Parent() post: Post,
    @Args('q') q: string,
    @Args('first') first: number,
    @Args('last') last: number,
    @Args('before') before: string,
    @Args('after') after: string,
    @Args('filterBy') filterBy: any,
    @Args('orderBy') orderBy: string
  ): Promise<CommentsConnection> {
    const query = { where: { post: post.id } }

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
