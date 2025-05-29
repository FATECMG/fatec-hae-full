import { connectDatabase } from '@common/external/database/MongoDB'
import { type FindOneEntityRepository } from '@common/repository/RepositoryInterface'

import { type Course } from '@functions/course/entities/Course'
import { CourseModel } from '@functions/course/adapter/repository/MongoDB/model/CourseModel'
import { toDomain } from '@functions/course/adapter/repository/MongoDB/utils'

import { injectable } from 'inversify'

@injectable()
export class FindOneCourseMongoRepository implements FindOneEntityRepository<Course> {
  async perform (id: string): Promise<undefined | Course> {
    await connectDatabase()
    const result = await CourseModel.findOne({ id })
    return result === null ? undefined : toDomain(result)
  }
}
