import { Observable } from 'rxjs'
import { Metadata } from 'grpc'

import { IId, IQuery, ICount } from '../commons/commons.interface'
import { CommentsConnection, Comment } from '../graphql/typings'
import { CommentDto } from './comment.dto'

interface IUpdateCommentInput {
  id: string
  data: CommentDto
}

export interface ICommentsService {
  find(query: IQuery, metadata?: Metadata): Observable<CommentsConnection>
  findById(id: IId, metadata?: Metadata): Observable<Comment>
  findOne(query: IQuery, metadata?: Metadata): Observable<Comment>
  count(query: IQuery, metadata?: Metadata): Observable<ICount>
  create(input: CommentDto, metadata?: Metadata): Observable<Comment>
  update(input: IUpdateCommentInput, metadata?: Metadata): Observable<Comment>
  destroy(query: IQuery, metadata?: Metadata): Observable<ICount>
}
