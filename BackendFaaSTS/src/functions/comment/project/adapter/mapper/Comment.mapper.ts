import { type Mapper } from '@common/mapper/BaseMapper'

import { type CommentDTO } from '@functions/comment/project/entities/CommentDTO'
import { Comment } from '@functions/comment/project/entities/Comment'
import { type CommentPM } from '@functions/comment/project/entities/CommentPM'

import { injectable } from 'inversify'

@injectable()
export class CommentMapper implements Mapper<CommentDTO, Comment> {
  async execute (entity: CommentDTO): Promise<Comment> {
    return new Comment({
      author: entity.author,
      content: entity.content
    })
  }
}

@injectable()
export class CommentPresentationModelMapper implements Mapper<Comment, CommentPM> {
  async execute (entity: Comment): Promise<CommentPM> {
    return {
      id: entity.id,
      author: entity.author,
      content: entity.content,
      timestamp: entity.timestamp
    }
  }
}
