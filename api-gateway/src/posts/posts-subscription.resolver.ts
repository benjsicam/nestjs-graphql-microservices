import { Inject } from '@nestjs/common'
import { Resolver, Subscription } from '@nestjs/graphql'

import { PinoLogger } from 'nestjs-pino'
import { PubSub } from 'graphql-subscriptions'

@Resolver()
export class PostsSubscriptionResolver {
  constructor(
    @Inject('PubSubService')
    private readonly pubSubService: PubSub,

    private readonly logger: PinoLogger
  ) {
    logger.setContext(PostsSubscriptionResolver.name)
  }

  @Subscription('postAdded', {
    resolve: (value: Comment) => value
  })
  postAdded(): AsyncIterator<unknown, any, undefined> {
    return this.pubSubService.asyncIterator('postAdded')
  }
}
