import { connectDatabase } from '@common/external/database/MongoDB'
import { type FindAllEntityRepository } from '@common/repository/RepositoryInterface'

import { type Course } from '@functions/course/entities/Course'
import { CourseModel } from '@functions/course/adapter/repository/MongoDB/model/CourseModel'
import { toDomain } from '@functions/course/adapter/repository/MongoDB/utils'

import { injectable } from 'inversify'

@injectable()
export class FindAllCourseMongoRepository implements FindAllEntityRepository<Course> {
  async perform (active: boolean): Promise<Course[]> {
    await connectDatabase()
    const result = await CourseModel.find({ active })
    return result.map(eachDoc => toDomain(eachDoc))
  }
}
