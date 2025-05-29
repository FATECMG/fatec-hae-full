export interface CommentPM {
  id: string
  author: AuthorCommentPM
  content: string
  timestamp: string
}

export interface AuthorCommentPM {
  id: string
  name: string
}
