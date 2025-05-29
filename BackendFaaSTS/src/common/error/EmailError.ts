export abstract class MailError extends Error {
  readonly field: string = 'email'
  constructor () {
    super()
    this.message = `Erro ao enviar email ${this.message} `
    this.name = 'MailError'
  }
}

export class MailAuthError extends MailError {
  readonly field: string = 'email'
  constructor () {
    super()
    this.message = `Erro ao autenticar email ${this.message}`
    this.name = 'MailAuthError'
  }
}
