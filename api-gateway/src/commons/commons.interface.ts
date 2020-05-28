export interface IId {
  id: string
}

export interface IQuery {
  select?: string[]
  where?: string
  orderBy?: string[]
  limit?: number
  before?: string
  after?: string
}

export interface ICount {
  count: number
}
