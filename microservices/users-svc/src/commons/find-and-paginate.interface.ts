import { WhereOptions, FindAttributeOptions } from 'sequelize/types'

export interface IFindAndPaginateOptions {
  attributes: FindAttributeOptions
  where: WhereOptions
  order: string[]
  limit: number
  before: string
  after: string
}

export interface ICursor {
  before: string
  after: string
  hasNext: boolean
  hasPrevious: boolean
}

export interface IFindAndPaginateResult<T> {
  results: T[]
  cursors: ICursor
}
