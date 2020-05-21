import { FindOptions } from 'sequelize/types'

import { User } from './user.model'
import { UserDto } from './user.dto'
import { IFindAndPaginateOptions, IFindAndPaginateResult } from '../commons/find-and-paginate.interface'

export interface IUsersService {
  find(query?: IFindAndPaginateOptions): Promise<IFindAndPaginateResult<User>>
  findById(id: string): Promise<User>
  findOne(query?: FindOptions): Promise<User>
  count(query?: FindOptions): Promise<number>
  create(comment: UserDto): Promise<User>
  update(id: string, comment: UserDto): Promise<User>
  destroy(query?: FindOptions): Promise<number>
}
