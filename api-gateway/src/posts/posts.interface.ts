import { Observable } from 'rxjs'

import { Iid, IQuery, ICount } from '../commons/commons.interface'
import { Post, PostsConnection } from '../graphql/typings'
import { PostDto } from './post.dto'

interface UpdatePostInput {
  id: string
  data: PostDto
}

export interface IPostsService {
  find(query: IQuery): Observable<PostsConnection>
  findById(id: Iid): Observable<Post>
  findOne(query: IQuery): Observable<Post>
  count(query: IQuery): Observable<ICount>
  create(input: PostDto): Observable<Post>
  update(input: UpdatePostInput): Observable<Post>
  destroy(query: IQuery): Observable<ICount>
}
