export abstract class DateError extends Error {
  field: string = ''
  constructor (readonly message: string) {
    super(message)
    this.name = 'DateError'
  }
}

export class InvalidFormatDate extends DateError {
  constructor (field: string) {
    super('Data com formato inválido, verifique novamente')
    this.name = 'InvalidDate'
    this.field = field
  }
}

export class InvalidRangeDate extends DateError {
  constructor (field: string, message?: string) {
    super(message ?? 'Data inválida, verifique novamente')
    this.name = 'InvalidDate'
    this.field = field ?? 'Campo Não Informado'
  }
}
