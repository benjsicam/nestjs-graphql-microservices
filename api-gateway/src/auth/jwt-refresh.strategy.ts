import { PassportStrategy } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config'
import { Injectable, OnModuleInit, Inject } from '@nestjs/common'
import { ClientGrpcProxy } from '@nestjs/microservices'

import { PinoLogger } from 'nestjs-pino'
import { get } from 'lodash'
import { Strategy, ExtractJwt } from 'passport-jwt'

import { IUsersService } from '../users/users.interface'
import { User } from '../graphql/typings'

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') implements OnModuleInit {
  constructor(
    @Inject('UsersServiceClient')
    private readonly usersServiceClient: ClientGrpcProxy,

    private readonly configService: ConfigService,

    private readonly logger: PinoLogger
  ) {
    super({
      secretOrKey: configService.get<string>('JWT_REFRESHTOKEN_SECRET'),
      issuer: configService.get<string>('JWT_ISSUER'),
      audience: configService.get<string>('JWT_AUDIENCE'),
      jwtFromRequest: ExtractJwt.fromExtractors([(req) => get(req, 'cookies.refresh-token')])
    })

    logger.setContext(JwtRefreshStrategy.name)
  }

  private usersService: IUsersService

  onModuleInit(): void {
    this.usersService = this.usersServiceClient.getService<IUsersService>('UsersService')
  }

  async validate(payload: any): Promise<User> {
    return this.usersService
      .findById({
        id: payload.sub
      })
      .toPromise()
  }
}
