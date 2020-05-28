import { FindOptions } from 'sequelize/types'

import { Post } from './post.model'
import { PostDto } from './post.dto'
import { IFindAndPaginateOptions, IFindAndPaginateResult } from '../commons/find-and-paginate.interface'

export interface IPostUpdateInput {
  id: string
  data: PostDto
}

export interface IPostsService {
  find(query?: IFindAndPaginateOptions): Promise<IFindAndPaginateResult<Post>>
  findById(id: string): Promise<Post>
  findOne(query?: FindOptions): Promise<Post>
  count(query?: FindOptions): Promise<number>
  create(post: PostDto): Promise<Post>
  update(id: string, post: PostDto): Promise<Post>
  destroy(query?: FindOptions): Promise<number>
}
