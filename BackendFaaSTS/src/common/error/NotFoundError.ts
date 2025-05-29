/**
 * @class NotFoundError
 * Error class to be thrown when an entity is not found at the database.
 * Related to HTTP 404 status code.
 */
export abstract class NotFoundError extends Error {
  field: string = ''
  fieldValue: string = ''
  entityName: string = ''

  constructor (readonly message: string) {
    super(message)
  }
}

export class IDNotFoundError extends NotFoundError {
  constructor (readonly id: string, readonly entityName: string) {
    super(`Não foi possível encontrar ${entityName} com id: ${id}`)
    this.name = 'IDNotFoundError'
    this.field = 'ID'
    this.fieldValue = id
    this.entityName = entityName
  }
}

export class EntityNotFoundByNameError extends NotFoundError {
  constructor (readonly value: string, readonly entityName: string) {
    super(`Não foi possível encontrar ${entityName} com nome: ${value}`)
    this.name = 'EntityNotFoundByNameError'
    this.field = 'Nome'
    this.fieldValue = value
    this.entityName = entityName
  }
}

export class UserNotFoundError extends NotFoundError {
  constructor (readonly value: string) {
    super('Não foi possível encontrar usuário')
    this.name = 'UserNotFoundError'
    this.field = 'Nome'
    this.fieldValue = value
    this.entityName = 'Usuario'
  }
}
