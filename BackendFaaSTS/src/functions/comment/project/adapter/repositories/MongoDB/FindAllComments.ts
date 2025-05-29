import { connectDatabase } from '@common/external/database/MongoDB'
import { type FindAllFromEntityRepository } from '@common/repository/RepositoryInterface'

import { ProjectModel } from '@functions/project/adapter/repositories/MongoDB/model/ProjectModel'
import { type Comment } from '@functions/comment/project/entities/Comment'

import { injectable } from 'inversify'

@injectable()
export class FindAllCommentsFromProjectRepository implements FindAllFromEntityRepository<Comment> {
  async perform (id: string): Promise<Comment[]> {
    await connectDatabase()
    const result = await ProjectModel.findOne({ id })
    return result === null
      ? []
      : result.comments.map(each => {
        return {
          id: each.id,
          author: each.author,
          content: each.content,
          timestamp: each.timestamp
        }
      })
  }
}
