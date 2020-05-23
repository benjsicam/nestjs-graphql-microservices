import { Observable } from 'rxjs'

import { Iid, IQuery, ICount } from '../commons/commons.interface'
import { CommentsConnection, Comment } from '../graphql/typings'
import { CommentDto } from './comment.dto'

interface IUpdateCommentInput {
  id: string
  data: CommentDto
}

export interface ICommentsService {
  find(query: IQuery): Observable<CommentsConnection>
  findById(id: Iid): Observable<Comment>
  findOne(query: IQuery): Observable<Comment>
  count(query: IQuery): Observable<ICount>
  create(input: CommentDto): Observable<Comment>
  update(input: IUpdateCommentInput): Observable<Comment>
  destroy(query: IQuery): Observable<ICount>
}
