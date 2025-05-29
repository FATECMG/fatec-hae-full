export abstract class AuthenticationError extends Error {
  field: string = ''
  constructor (message: string) {
    super(message)
    this.name = 'AuthError'
  }
}

export class UserDataAlreadyExistsError extends AuthenticationError {
  constructor (field: string) {
    super(`${field.toUpperCase()} já cadastrado!`)
    this.name = 'UserDataAlreadyExistsError'
    this.field = field
  }
}

export class InvalidCredentialsError extends AuthenticationError {
  constructor (field: string) {
    super('Login inválido! Dados incorretos.')
    this.name = 'InvalidCredentialsError'
    this.field = field
  }
}

export class InvalidTokenError extends AuthenticationError {
  constructor () {
    super('Token inválido!')
    this.name = 'InvalidTokenError'
    this.field = 'token'
  }
}
