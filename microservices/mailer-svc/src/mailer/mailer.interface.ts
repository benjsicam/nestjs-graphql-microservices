export interface ISendMailInput {
  template: string
  to: string
  data: Buffer
}

export interface ISendMailPayload {
  isSent: boolean
}
