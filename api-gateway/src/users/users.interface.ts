import { Observable } from 'rxjs'

import { Iid, IQuery, ICount } from '../commons/commons.interface'
import { User, UsersConnection } from '../graphql/typings'
import { UserDto } from './user.dto'

interface UpdateUserInput {
  id: string
  data: UserDto
}

export interface IUsersService {
  find(query: IQuery): Observable<UsersConnection>
  findById(id: Iid): Observable<User>
  findOne(query: IQuery): Observable<User>
  count(query: IQuery): Observable<ICount>
  create(input: UserDto): Observable<User>
  update(input: UpdateUserInput): Observable<User>
  destroy(query: IQuery): Observable<ICount>
}
