import { Inject, OnModuleInit, UseGuards } from '@nestjs/common'
import { ClientGrpcProxy } from '@nestjs/microservices'
import { Query, Resolver, Args } from '@nestjs/graphql'

import { isEmpty, merge } from 'lodash'
import { PinoLogger } from 'nestjs-pino'

import { IUsersService } from './users.interface'
import { User, UsersConnection } from '../graphql/typings'

import { QueryUtils } from '../utils/query.utils'
import { GqlAuthGuard } from '../auth/gql-auth.guard'
import { CurrentUser } from '../auth/user.decorator'

@Resolver('User')
export class UsersQueryResolver implements OnModuleInit {
  constructor(
    @Inject('UsersServiceClient')
    private readonly usersServiceClient: ClientGrpcProxy,

    private readonly queryUtils: QueryUtils,

    private readonly logger: PinoLogger
  ) {
    logger.setContext(UsersQueryResolver.name)
  }

  private usersService: IUsersService

  onModuleInit(): void {
    this.usersService = this.usersServiceClient.getService<IUsersService>('UsersService')
  }

  @Query('users')
  @UseGuards(GqlAuthGuard)
  async getUsers(
    @Args('q') q: string,
    @Args('first') first: number,
    @Args('last') last: number,
    @Args('before') before: string,
    @Args('after') after: string,
    @Args('filterBy') filterBy: any,
    @Args('orderBy') orderBy: string
  ): Promise<UsersConnection> {
    const query = { where: {} }

    if (!isEmpty(q)) merge(query, { where: { name: { _iLike: q } } })

    merge(query, await this.queryUtils.buildQuery(filterBy, orderBy, first, last, before, after))

    return this.usersService
      .find({
        ...query,
        where: JSON.stringify(query.where)
      })
      .toPromise()
  }

  @Query('user')
  @UseGuards(GqlAuthGuard)
  async getUser(@Args('id') id: string): Promise<User> {
    return this.usersService.findById({ id }).toPromise()
  }

  @Query('userCount')
  @UseGuards(GqlAuthGuard)
  async getUserCount(@Args('q') q: string, @Args('filterBy') filterBy: any): Promise<number> {
    const query = { where: {} }

    if (!isEmpty(q)) merge(query, { where: { name: { _iLike: q } } })

    merge(query, await this.queryUtils.getFilters(filterBy))

    const { count } = await this.usersService
      .count({
        ...query,
        where: JSON.stringify(query.where)
      })
      .toPromise()

    return count
  }

  @Query('me')
  @UseGuards(GqlAuthGuard)
  async getProfile(@CurrentUser() user: User): Promise<User> {
    return this.usersService.findById({ id: user.id }).toPromise()
  }
}
