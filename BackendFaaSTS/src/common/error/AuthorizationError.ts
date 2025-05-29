export abstract class AuthorizationError extends Error {
  constructor (message: string) {
    super(message)
    this.name = 'AuthorizationError'
  }
}

export class NotAuthorizedToCreateResourceError extends AuthorizationError {
  constructor (resource: string) {
    super(ErrorMessages.NOT_AUTHORIZED_TO_CREATE_RESOURCE(resource))
    this.name = 'NotAuthorizedToCreateResourceError'
  }
}

export class NotAuthorizedToModifyResourceError extends AuthorizationError {
  constructor (resource: string) {
    super(ErrorMessages.NOT_AUTHORIZED_TO_MODIFY_RESOURCE(resource))
    this.name = 'NotAuthorizedToModifyResourceError'
  }
}

const ErrorMessages = {
  NOT_AUTHORIZED_TO_CREATE_RESOURCE:
        (resource: string) => `Usuário não tem permissão para criar ${resource}s!`.toLocaleUpperCase(),
  NOT_AUTHORIZED_TO_MODIFY_RESOURCE:
        (resource: string) => `Usuário não tem permissão para modificar ${resource}s!`.toLocaleUpperCase()             
}
