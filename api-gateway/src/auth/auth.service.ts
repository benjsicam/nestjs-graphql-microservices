import { Injectable, Inject } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PinoLogger } from 'nestjs-pino'

import { User } from '../graphql/typings'

@Injectable()
export class AuthService {
  constructor(
    @Inject('JwtAccessTokenService')
    private readonly accessTokenService: JwtService,

    @Inject('JwtRefreshTokenService')
    private readonly refreshTokenService: JwtService,

    private readonly logger: PinoLogger
  ) {
    logger.setContext(AuthService.name)
  }

  async generateAccessToken(user: User): Promise<string> {
    return this.accessTokenService.sign(
      {
        user: user.id
      },
      {
        subject: user.id
      }
    )
  }

  async generateRefreshToken(user: User): Promise<string> {
    return this.refreshTokenService.sign(
      {
        user: user.email
      },
      {
        subject: user.id
      }
    )
  }
}
