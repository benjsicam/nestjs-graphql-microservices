import { isEmpty } from 'lodash'
import { PinoLogger } from 'nestjs-pino'
import { Injectable } from '@nestjs/common'
import { FindOptions } from 'sequelize/types'
import { InjectModel } from '@nestjs/sequelize'

import { IPostsService } from './posts.interface'
import { IFindAndPaginateOptions, IFindAndPaginateResult } from '../commons/find-and-paginate.interface'

import { Post } from './post.model'
import { PostDto } from './post.dto'

@Injectable()
export class PostsService implements IPostsService {
  constructor(@InjectModel(Post) private readonly repo: typeof Post, private readonly logger: PinoLogger) {
    logger.setContext(PostsService.name)
  }

  async find(query?: IFindAndPaginateOptions): Promise<IFindAndPaginateResult<Post>> {
    this.logger.info('PostsService#findAll.call %o', query)

    // @ts-ignore
    const result: IFindAndPaginateResult<Post> = await this.repo.findAndPaginate({
      ...query,
      raw: true,
      paranoid: false
    })

    this.logger.info('PostsService#findAll.result %o', result)

    return result
  }

  async findById(id: string): Promise<Post> {
    this.logger.info('PostsService#findById.call %o', id)

    const result: Post = await this.repo.findByPk(id, {
      raw: true
    })

    this.logger.info('PostsService#findById.result %o', result)

    return result
  }

  async findOne(query: FindOptions): Promise<Post> {
    this.logger.info('PostsService#findOne.call %o', query)

    const result: Post = await this.repo.findOne({
      ...query,
      raw: true
    })

    this.logger.info('PostsService#findOne.result %o', result)

    return result
  }

  async count(query?: FindOptions): Promise<number> {
    this.logger.info('PostsService#count.call %o', query)

    const result: number = await this.repo.count(query)

    this.logger.info('PostsService#count.result %o', result)

    return result
  }

  async create(commentDto: PostDto): Promise<Post> {
    this.logger.info('PostsService#create.call %o', commentDto)

    const result: Post = await this.repo.create(commentDto)

    this.logger.info('PostsService#create.result %o', result)

    return result
  }

  async update(id: string, comment: PostDto): Promise<Post> {
    this.logger.info('PostsService#update.call %o', comment)

    const record: Post = await this.repo.findByPk(id)

    if (isEmpty(record)) throw new Error('Record not found.')

    const result: Post = await record.update(comment)

    this.logger.info('PostsService#update.result %o', result)

    return result
  }

  async destroy(query?: FindOptions): Promise<number> {
    this.logger.info('PostsService#destroy.call %o', query)

    const result: number = await this.repo.destroy(query)

    this.logger.info('PostsService#destroy.result %o', result)

    return result
  }
}
