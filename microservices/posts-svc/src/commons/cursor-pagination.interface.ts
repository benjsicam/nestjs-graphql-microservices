export interface IEdge<T> {
  node: T
  cursor: string
}

export interface IPageInfo {
  startCursor: string
  endCursor: string
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface IFindPayload<T> {
  edges: IEdge<T>[]
  pageInfo: IPageInfo
}
