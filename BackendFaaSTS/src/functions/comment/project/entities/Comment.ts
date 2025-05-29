import { v4 as uuid } from 'uuid'

export interface CommentProps {
  author: AuthorCommentProps
  content: string
}

export interface AuthorCommentProps {
  id: string
  name: string
}

export class Comment {
  id: string
  author: AuthorCommentProps
  content: string
  timestamp: string

  constructor (props: CommentProps) {
    this.id = uuid()
    this.author = props.author
    this.content = props.content
    this.timestamp = new Date().toISOString()
  }
}
