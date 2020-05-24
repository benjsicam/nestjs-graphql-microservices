import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import Redis from 'ioredis'
import { RedisPubSub } from 'graphql-redis-subscriptions'

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'PubSubService',
      useFactory: async (configService: ConfigService): Promise<RedisPubSub> => {
        const redisOptions: Redis.RedisOptions = {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          password: configService.get<string>('REDIS_PASSWORD'),
          keyPrefix: configService.get<string>('NODE_ENV')
        }

        return new RedisPubSub({
          publisher: new Redis(redisOptions),
          subscriber: new Redis(redisOptions)
        })
      },
      inject: [ConfigService]
    }
  ],
  exports: ['PubSubService']
})
export class CommonsModule {}
