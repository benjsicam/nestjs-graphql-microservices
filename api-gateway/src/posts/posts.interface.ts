import { Observable } from 'rxjs'
import { Metadata } from 'grpc'

import { IId, IQuery, ICount } from '../commons/commons.interface'
import { Post, PostsConnection } from '../graphql/typings'
import { PostDto } from './post.dto'

interface UpdatePostInput {
  id: string
  data: PostDto
}

export interface IPostsService {
  find(query: IQuery, metadata?: Metadata): Observable<PostsConnection>
  findById(id: IId, metadata?: Metadata): Observable<Post>
  findOne(query: IQuery, metadata?: Metadata): Observable<Post>
  count(query: IQuery, metadata?: Metadata): Observable<ICount>
  create(input: PostDto, metadata?: Metadata): Observable<Post>
  update(input: UpdatePostInput, metadata?: Metadata): Observable<Post>
  destroy(query: IQuery, metadata?: Metadata): Observable<ICount>
}
