export class CommentDTO {
  author: AuthorCommentDTO
  content: string

  constructor (props: ICommentDTO) {
    this.author = props.author
    this.content = props.content
  }
}

export interface ICommentDTO {
  author: AuthorCommentDTO
  content: string
}

export interface AuthorCommentDTO {
  id: string
  name: string
}
