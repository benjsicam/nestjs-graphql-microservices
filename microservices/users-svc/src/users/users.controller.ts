import Aigle from 'aigle'

import { PinoLogger } from 'nestjs-pino'
import { Controller, Inject } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import { isEmpty, isNil } from 'lodash'

import { ICount, IQuery } from '../commons/commons.interface'
import { IUsersService } from './users.interface'
import { IFindPayload } from '../commons/cursor-pagination.interface'

import { User } from './user.model'
import { UserDto } from './user.dto'

const { map } = Aigle

@Controller()
export class UsersController {
  constructor(@Inject('UsersService') private readonly service: IUsersService, private readonly logger: PinoLogger) {
    logger.setContext(UsersController.name)
  }

  @GrpcMethod('UsersService', 'find')
  async find(query: IQuery): Promise<IFindPayload<User>> {
    this.logger.info('UsersController#findAll.call %o', query)

    const { results, cursors } = await this.service.find({
      attributes: !isEmpty(query.select) ? ['id'].concat(query.select) : undefined,
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
      order: !isEmpty(query.orderBy) ? query.orderBy : undefined,
      limit: !isNil(query.limit) ? query.limit : 25,
      before: !isEmpty(query.before) ? query.before : undefined,
      after: !isEmpty(query.after) ? query.after : undefined
    })

    const result: IFindPayload<User> = {
      edges: await map(results, async (comment: User) => ({
        node: comment,
        cursor: Buffer.from(JSON.stringify([comment.id])).toString('base64')
      })),
      pageInfo: {
        startCursor: cursors.before || '',
        endCursor: cursors.after || '',
        hasNextPage: cursors.hasNext || false,
        hasPreviousPage: cursors.hasPrevious || false
      }
    }

    this.logger.info('UsersController#findAll.result %o', result)

    return result
  }

  @GrpcMethod('UsersService', 'findById')
  async findById({ id }): Promise<User> {
    this.logger.info('UsersController#findById.call %o', id)

    const result: User = await this.service.findById(id)

    this.logger.info('UsersController#findById.result %o', result)

    if (isEmpty(result)) throw new Error('Record not found.')

    return result
  }

  @GrpcMethod('UsersService', 'findOne')
  async findOne(query: IQuery): Promise<User> {
    this.logger.info('UsersController#findOne.call %o', query)

    const result: User = await this.service.findOne({
      attributes: !isEmpty(query.select) ? query.select : undefined,
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined
    })

    this.logger.info('UsersController#findOne.result %o', result)

    if (isEmpty(result)) throw new Error('Record not found.')

    return result
  }

  @GrpcMethod('UsersService', 'count')
  async count(query: IQuery): Promise<ICount> {
    this.logger.info('UsersController#count.call %o', query)

    const count: number = await this.service.count({
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined
    })

    this.logger.info('UsersController#count.result %o', count)

    return { count }
  }

  @GrpcMethod('UsersService', 'create')
  async create(data: UserDto): Promise<User> {
    this.logger.info('UsersController#create.call %o', data)

    const result: User = await this.service.create(data)

    this.logger.info('UsersController#create.result %o', result)

    return result
  }

  @GrpcMethod('UsersService', 'update')
  async update({ id, data }): Promise<User> {
    this.logger.info('UsersController#update.call %o %o', id, data)

    const result: User = await this.service.update(id, data)

    this.logger.info('UsersController#update.result %o', result)

    return result
  }

  @GrpcMethod('UsersService', 'destroy')
  async destroy(query: IQuery): Promise<ICount> {
    this.logger.info('UsersController#destroy.call %o', query)

    const count: number = await this.service.destroy({
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined
    })

    this.logger.info('UsersController#destroy.result %o', count)

    return { count }
  }
}
