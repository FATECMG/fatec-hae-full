export abstract class ResourceError extends Error {
  constructor (message: string) {
    super(message)
    this.name = 'ResourceError'
  }
}

export class UnableToCreateResourceError extends ResourceError {
  constructor (message: string) {
    super(message)
    this.name = 'UnableToCreateResourceError'
  }
}
