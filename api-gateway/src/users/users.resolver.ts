import { Inject, OnModuleInit, UseGuards } from '@nestjs/common'
import { ClientGrpcProxy } from '@nestjs/microservices'
import { Query, Resolver, Args, Parent, ResolveField, Mutation, Context } from '@nestjs/graphql'

import { isEmpty, merge } from 'lodash'
import { PinoLogger } from 'nestjs-pino'

import { ICommentsService } from '../comments/comments.interface'
import { IPostsService } from '../posts/posts.interface'
import { IUsersService } from './users.interface'
import {
  CommentsConnection,
  User,
  UsersConnection,
  PostsConnection,
  SignupUserInput,
  UserPayload,
  UpdateProfileInput,
  UpdateEmailInput,
  LoginUserInput,
  UpdatePasswordInput,
  DeleteAccountPayload
} from '../graphql/typings'

import { QueryUtils } from '../utils/query.utils'
import { PasswordUtils } from '../utils/password.utils'
import { AuthService } from '../auth/auth.service'
import { GqlAuthGuard } from '../auth/gql.authguard'
import { CurrentUser } from '../auth/user.decorator'

@Resolver('User')
export class UsersResolver implements OnModuleInit {
  constructor(
    @Inject('CommentsServiceClient')
    private readonly commentsServiceClient: ClientGrpcProxy,

    @Inject('PostsServiceClient')
    private readonly postsServiceClient: ClientGrpcProxy,

    @Inject('UsersServiceClient')
    private readonly usersServiceClient: ClientGrpcProxy,

    private readonly authService: AuthService,

    private readonly queryUtils: QueryUtils,

    private readonly passwordUtils: PasswordUtils,

    private readonly logger: PinoLogger
  ) {
    logger.setContext(UsersResolver.name)
  }

  private commentsService: ICommentsService

  private postsService: IPostsService

  private usersService: IUsersService

  onModuleInit(): void {
    this.commentsService = this.commentsServiceClient.getService<ICommentsService>('CommentsService')
    this.postsService = this.postsServiceClient.getService<IPostsService>('PostsService')
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
  // @UseGuards(GqlAuthGuard)
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

  @Mutation()
  async signup(@Args('data') data: SignupUserInput): Promise<UserPayload> {
    const { count } = await this.usersService
      .count({
        where: JSON.stringify({ email: data.email })
      })
      .toPromise()

    if (count >= 1) throw new Error('Email taken')

    const user: User = await this.usersService
      .create({
        ...data,
        password: await this.passwordUtils.hash(data.password)
      })
      .toPromise()

    return { user }
  }

  @Mutation()
  async login(@Context() context: any, @Args('data') data: LoginUserInput): Promise<UserPayload> {
    const { res } = context

    const user: any = await this.usersService
      .findOne({
        where: JSON.stringify({ email: data.email })
      })
      .toPromise()

    if (isEmpty(user)) throw new Error('Unable to login')

    const isSame: boolean = await this.passwordUtils.compare(data.password, user.password)

    if (!isSame) throw new Error('Unable to login')

    res.cookie('access-token', await this.authService.generateAccessToken(user), {
      httpOnly: true,
      maxAge: 1.8e6
    })
    res.cookie('refresh-token', await this.authService.generateRefreshToken(user), {
      httpOnly: true,
      maxAge: 1.728e8
    })

    return { user }
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async updateProfile(@CurrentUser() user: User, @Args('data') data: UpdateProfileInput): Promise<UserPayload> {
    const updatedUser: User = await this.usersService
      .update({
        id: user.id,
        data: {
          ...data
        }
      })
      .toPromise()

    return { user: updatedUser }
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async updateEmail(@CurrentUser() user: any, @Args('data') data: UpdateEmailInput): Promise<UserPayload> {
    const { count } = await this.usersService
      .count({
        where: JSON.stringify({ email: data.email })
      })
      .toPromise()

    if (count >= 1) throw new Error('Email taken')

    const isSame: boolean = await this.passwordUtils.compare(data.currentPassword, user.password)

    if (!isSame) throw new Error('Error updating email. Kindly check the email or password provided')

    const updatedUser: User = await this.usersService
      .update({
        id: user.id,
        data: {
          ...data
        }
      })
      .toPromise()

    return { user: updatedUser }
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async updatePassword(@CurrentUser() user: any, @Args('data') data: UpdatePasswordInput): Promise<UserPayload> {
    const isSame: boolean = await this.passwordUtils.compare(data.currentPassword, user.password)
    const isConfirmed: boolean = data.newPassword === data.confirmPassword

    if (!isSame || !isConfirmed) {
      throw new Error('Error updating password. Kindly check your passwords.')
    }

    const password: string = await this.passwordUtils.hash(data.newPassword)

    const updatedUser: any = await this.usersService.update({
      id: user.id,
      data: {
        password
      }
    })

    return { user: updatedUser }
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async deleteAccount(@CurrentUser() user: User): Promise<DeleteAccountPayload> {
    return this.usersService
      .destroy({
        where: JSON.stringify({
          id: user.id
        })
      })
      .toPromise()
  }
}
