export abstract class CommentError extends Error {
  name: string
  field: string
  constructor (readonly message: string) {
    super(message)
    this.name = 'CommentError'
    this.field = 'comentário'
  }
}

export class CommentNotCreated extends CommentError {
  constructor () {
    super('Não foi possível criar o comentário')
    this.name = 'CommentNotCreated'
  }
}
