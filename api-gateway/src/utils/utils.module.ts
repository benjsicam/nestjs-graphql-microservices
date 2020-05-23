import { Module } from '@nestjs/common'

import { QueryUtils } from './query.utils'
import { PasswordUtils } from './password.utils'

@Module({
  exports: [QueryUtils, PasswordUtils],
  providers: [QueryUtils, PasswordUtils]
})
export class UtilsModule {}
