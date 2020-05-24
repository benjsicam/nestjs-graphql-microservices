import { Injectable, ExecutionContext } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { GqlExecutionContext } from '@nestjs/graphql'

@Injectable()
export class RefreshAuthGuard extends AuthGuard('jwt-refresh') {
  getRequest(context: ExecutionContext): any {
    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext().req
  }
}
