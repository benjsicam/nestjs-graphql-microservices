import { Inject, OnModuleInit } from '@nestjs/common'
import { ClientGrpcProxy } from '@nestjs/microservices'
import { Query, Resolver, Args } from '@nestjs/graphql'

import { isEmpty, merge } from 'lodash'
import { PinoLogger } from 'nestjs-pino'

import { ICommentsService } from './comments.interface'
import { CommentsConnection } from '../graphql/typings'

import { QueryUtils } from '../utils/query.utils'

@Resolver()
export class CommentsQueryResolver implements OnModuleInit {
  constructor(
    @Inject('CommentsServiceClient')
    private readonly commentsServiceClient: ClientGrpcProxy,

    private readonly queryUtils: QueryUtils,

    private readonly logger: PinoLogger
  ) {
    logger.setContext(CommentsQueryResolver.name)
  }

  private commentsService: ICommentsService

  onModuleInit(): void {
    this.commentsService = this.commentsServiceClient.getService<ICommentsService>('CommentsService')
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
}
