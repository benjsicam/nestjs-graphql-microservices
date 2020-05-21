import { isEmpty } from 'lodash'
import { PinoLogger } from 'nestjs-pino'
import { Injectable } from '@nestjs/common'
import { FindOptions } from 'sequelize/types'
import { InjectModel } from '@nestjs/sequelize'

import { ICommentsService } from './comments.interface'
import { IFindAndPaginateOptions, IFindAndPaginateResult } from '../commons/find-and-paginate.interface'

import { Comment } from './comment.model'
import { CommentDto } from './comment.dto'

@Injectable()
export class CommentsService implements ICommentsService {
  constructor(
    @InjectModel(Comment)
    private readonly repo: typeof Comment,
    private readonly logger: PinoLogger
  ) {
    logger.setContext(CommentsService.name)
  }

  async find(query?: IFindAndPaginateOptions): Promise<IFindAndPaginateResult<Comment>> {
    this.logger.info('CommentsService#findAll.call %o', query)

    // @ts-ignore
    const result: IFindAndPaginateResult<Comment> = await this.repo.findAndPaginate({
      ...query,
      raw: true,
      paranoid: false
    })

    this.logger.info('CommentsService#findAll.result %o', result)

    return result
  }

  async findById(id: string): Promise<Comment> {
    this.logger.info('CommentsService#findById.call %o', id)

    const result: Comment = await this.repo.findByPk(id, {
      raw: true
    })

    this.logger.info('CommentsService#findById.result %o', result)

    return result
  }

  async findOne(query: FindOptions): Promise<Comment> {
    this.logger.info('CommentsService#findOne.call %o', query)

    const result: Comment = await this.repo.findOne({
      ...query,
      raw: true
    })

    this.logger.info('CommentsService#findOne.result %o', result)

    return result
  }

  async count(query?: FindOptions): Promise<number> {
    this.logger.info('CommentsService#count.call %o', query)

    const result: number = await this.repo.count(query)

    this.logger.info('CommentsService#count.result %o', result)

    return result
  }

  async create(commentDto: CommentDto): Promise<Comment> {
    this.logger.info('CommentsService#create.call %o', commentDto)

    const result: Comment = await this.repo.create(commentDto)

    this.logger.info('CommentsService#create.result %o', result)

    return result
  }

  async update(id: string, comment: CommentDto): Promise<Comment> {
    this.logger.info('CommentsService#update.call %o', comment)

    const record: Comment = await this.repo.findByPk(id)

    if (isEmpty(record)) throw new Error('Record not found.')

    const result: Comment = await record.update(comment)

    this.logger.info('CommentsService#update.result %o', result)

    return result
  }

  async destroy(query?: FindOptions): Promise<number> {
    this.logger.info('CommentsService#destroy.call %o', query)

    const result: number = await this.repo.destroy(query)

    this.logger.info('CommentsService#destroy.result %o', result)

    return result
  }
}
