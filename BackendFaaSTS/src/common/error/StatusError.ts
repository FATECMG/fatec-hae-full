export abstract class StatusError extends Error {
  name: string
  field: string
  constructor (readonly message: string) {
    super(message)
    this.name = 'StatusError'
    this.field = 'status'
  }
}

export class StatusNotValid extends StatusError {
  constructor () {
    super('O status informado não é válido')
    this.name = 'StatusNotValid'
  }
}

export class StatusNotUpdated extends StatusError {
  constructor () {
    super('Não foi possível atualizar o status do projeto')
    this.name = 'StatusNotUpdated'
  }
}

export class StatusNotValidChange extends StatusError {
  constructor () {
    super('Não é possível realizar a transição de status solicitada')
    this.name = 'StatusNotValidChange'
  }
}
