import { Inject, OnModuleInit, UseGuards } from '@nestjs/common'
import { ClientGrpcProxy } from '@nestjs/microservices'
import { Query, Resolver, Args, Parent, ResolveField, Mutation, Context, Subscription } from '@nestjs/graphql'

import { isEmpty, merge } from 'lodash'
import { PinoLogger } from 'nestjs-pino'
import { PubSub } from 'graphql-subscriptions'

import { ICommentsService } from '../comments/comments.interface'
import { IPostsService } from './posts.interface'
import { IUsersService } from '../users/users.interface'
import { GqlAuthGuard } from '../auth/gql.authguard'
import { CurrentUser } from '../auth/user.decorator'
import { CommentsConnection, Post, User, PostsConnection, PostPayload, UpdatePostInput, DeletePostPayload } from '../graphql/typings'

import { QueryUtils } from '../utils/query.utils'
import { PostDto } from './post.dto'

@Resolver('Post')
export class PostsResolver implements OnModuleInit {
  constructor(
    @Inject('CommentsServiceClient')
    private readonly commentsServiceClient: ClientGrpcProxy,

    @Inject('PostsServiceClient')
    private readonly postsServiceClient: ClientGrpcProxy,

    @Inject('UsersServiceClient')
    private readonly usersServiceClient: ClientGrpcProxy,

    @Inject('PubSubService')
    private readonly pubSubService: PubSub,

    private readonly queryUtils: QueryUtils,

    private readonly logger: PinoLogger
  ) {
    logger.setContext(PostsResolver.name)
  }

  private commentsService: ICommentsService

  private postsService: IPostsService

  private usersService: IUsersService

  onModuleInit(): void {
    this.commentsService = this.commentsServiceClient.getService<ICommentsService>('CommentsService')
    this.postsService = this.postsServiceClient.getService<IPostsService>('PostsService')
    this.usersService = this.usersServiceClient.getService<IUsersService>('UsersService')
  }

  @Query('posts')
  async getPosts(
    @Args('q') q: string,
    @Args('first') first: number,
    @Args('last') last: number,
    @Args('before') before: string,
    @Args('after') after: string,
    @Args('filterBy') filterBy: any,
    @Args('orderBy') orderBy: string
  ): Promise<PostsConnection> {
    const query = { where: {} }

    if (!isEmpty(q)) merge(query, { where: { title: { _iLike: q } } })

    merge(query, await this.queryUtils.buildQuery(filterBy, orderBy, first, last, before, after))

    return this.postsService
      .find({
        ...query,
        where: JSON.stringify(query.where)
      })
      .toPromise()
  }

  @Query('post')
  async getPost(@Args('id') id: string): Promise<Post> {
    return this.postsService.findById({ id }).toPromise()
  }

  @Query('postCount')
  async getPostCount(@Args('q') q: string, @Args('filterBy') filterBy: any): Promise<number> {
    const query = { where: {} }

    if (!isEmpty(q)) merge(query, { where: { title: { _iLike: q } } })

    merge(query, await this.queryUtils.getFilters(filterBy))

    const { count } = await this.postsService
      .count({
        ...query,
        where: JSON.stringify(query.where)
      })
      .toPromise()

    return count
  }

  @Query('myPosts')
  @UseGuards(GqlAuthGuard)
  async getMyPosts(
    @Context() context,
    @Args('q') q: string,
    @Args('first') first: number,
    @Args('last') last: number,
    @Args('before') before: string,
    @Args('after') after: string,
    @Args('filterBy') filterBy: any,
    @Args('orderBy') orderBy: string
  ): Promise<PostsConnection> {
    this.logger.info('========USER %o', context.req.user)
    const query = { where: { author: context.req.user.id } }

    if (!isEmpty(q)) merge(query, { where: { title: { _iLike: q } } })

    merge(query, await this.queryUtils.buildQuery(filterBy, orderBy, first, last, before, after))

    return this.postsService
      .find({
        ...query,
        where: JSON.stringify(query.where)
      })
      .toPromise()
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
  async updatePost(@Args('id') id: string, @Args('data') data: UpdatePostInput): Promise<PostPayload> {
    const post = await this.postsService
      .update({
        id,
        data: {
          ...data
        }
      })
      .toPromise()

    return { post }
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async deletePost(@Args('id') id: string): Promise<DeletePostPayload> {
    return this.postsService
      .destroy({
        where: JSON.stringify({ id })
      })
      .toPromise()
  }

  @Subscription('postAdded', {
    resolve: (value: Comment) => value
  })
  postAdded() {
    return this.pubSubService.asyncIterator('postAdded')
  }
}
