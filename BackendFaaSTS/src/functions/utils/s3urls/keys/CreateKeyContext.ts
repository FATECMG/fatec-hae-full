import { type CreateKeyInterface } from './CreateKey'

export interface CreateKeyParams {
  prefix: string
  fileName: string
  fileType?: string
}

export class CreateKeyContext {
  private readonly strategy: CreateKeyInterface

  constructor (strategy: CreateKeyInterface) {
    this.strategy = strategy
  }

  execute (params: CreateKeyParams): string {
    return this.strategy.execute(params)
  }
}
