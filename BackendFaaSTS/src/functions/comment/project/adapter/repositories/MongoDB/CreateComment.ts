import { CommentNotCreated } from '@common/error/CommentError'
import { connectDatabase } from '@common/external/database/MongoDB'
import { type UpdateEntityRepository } from '@common/repository/RepositoryInterface'

import { ProjectModel } from '@functions/project/adapter/repositories/MongoDB/model/ProjectModel'
import { type Comment } from '@functions/comment/project/entities/Comment'

import { injectable } from 'inversify'

@injectable()
export class CreateCommentProjectMongoRepository implements UpdateEntityRepository<Comment> {
  async perform (entity: Comment, id: string): Promise<Comment | undefined> {
    await connectDatabase()
    try {
      const projects = await ProjectModel
        .findOneAndUpdate({ id }, { $push: { comments: entity } }, { new: true })

      if (projects == null) return undefined

      return projects?.comments[projects.comments.length - 1]
    } catch (error) {
      throw new CommentNotCreated()
    }
  }
}
