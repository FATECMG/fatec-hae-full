import { IDomainError } from './interfaces.errors'

export class DomainError extends Error implements IDomainError {
  constructor(error: IDomainError) {
    super(error.message)
    this.errorCode = error.errorCode
    this.statusCode = 452
  }
  errorCode: string
  statusCode: number
}
