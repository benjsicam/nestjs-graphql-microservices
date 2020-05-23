import { compare, hash } from 'bcryptjs'

import { isEmpty } from 'lodash'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PasswordUtils {
  async compare(password: string, hash: string): Promise<boolean> {
    return compare(password, hash)
  }

  async hash(password: string): Promise<string> {
    if (isEmpty(password) || password.length < 8) {
      throw new Error('Password must be at least 8 characters.')
    }

    return hash(password, 10)
  }
}
