import { isEmpty, isNil, merge } from 'lodash'
import { Injectable } from '@nestjs/common'

import { IQuery } from '../commons/commons.interface'

@Injectable()
export class QueryUtils {
  async getFilters(filterBy: Record<string, any>): Promise<Record<string, any>> {
    const queryFilters = { where: {} }

    if (!isEmpty(filterBy)) Object.assign(queryFilters.where, filterBy)

    return queryFilters
  }

  async getOrder(orderBy: string): Promise<IQuery> {
    const queryOrder: IQuery = {}

    if (!isEmpty(orderBy)) {
      if (orderBy.trim().charAt(0) === '-') {
        Object.assign(queryOrder, { orderBy: [orderBy.trim().substr(1), 'DESC'] })
      } else {
        Object.assign(queryOrder, { orderBy: [orderBy.trim(), 'ASC'] })
      }
    }

    return queryOrder
  }

  async getCursor(first: number, last: number, before: string, after: string): Promise<IQuery> {
    const queryCursor: IQuery = {}

    if (!isNil(first)) Object.assign(queryCursor, { limit: first })

    if (!isEmpty(after)) {
      Object.assign(queryCursor, { after, limit: first })
    } else if (!isEmpty(before)) {
      Object.assign(queryCursor, { before, limit: last })
    }

    return queryCursor
  }

  async buildQuery(filterBy: Record<string, any>, orderBy: string, first: number, last: number, before: string, after: string): Promise<IQuery> {
    return merge({}, await this.getFilters(filterBy), await this.getOrder(orderBy), await this.getCursor(first, last, before, after))
  }
}
