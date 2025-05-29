import { connectDatabase } from '@common/external/database/MongoDB'
import { type DeleteEntityRepository } from '@common/repository/RepositoryInterface'

import { CourseModel } from '@functions/course/adapter/repository/MongoDB/model/CourseModel'

import { injectable } from 'inversify'

@injectable()
export class DeleteCourseMongoRepository implements DeleteEntityRepository {
  async perform (id: string): Promise<boolean> {
    await connectDatabase()
    const deleted = await CourseModel.findOneAndDelete({ id })
    return deleted !== null
  }
}
