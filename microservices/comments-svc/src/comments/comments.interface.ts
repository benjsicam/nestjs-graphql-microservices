import { FindOptions } from 'sequelize/types'

import { Comment } from './comment.model'
import { CommentDto } from './comment.dto'
import { IFindAndPaginateOptions, IFindAndPaginateResult } from '../commons/find-and-paginate.interface'

export interface ICommentUpdateInput {
  id: string
  data: CommentDto
}

export interface ICommentsService {
  find(query?: IFindAndPaginateOptions): Promise<IFindAndPaginateResult<Comment>>
  findById(id: string): Promise<Comment>
  findOne(query?: FindOptions): Promise<Comment>
  count(query?: FindOptions): Promise<number>
  create(comment: CommentDto): Promise<Comment>
  update(id: string, comment: CommentDto): Promise<Comment>
  destroy(query?: FindOptions): Promise<number>
}
