import { connectDatabase } from '@common/external/database/MongoDB'
import { type DeactivateEntityRepository } from '@common/repository/RepositoryInterface'

import { type Course } from '@functions/course/entities/Course'
import { CourseModel } from '@functions/course/adapter/repository/MongoDB/model/CourseModel'

import { injectable } from 'inversify'

@injectable()
export class DeactivateCourseMongoRepository implements DeactivateEntityRepository<Course> {
  async perform (id: string): Promise<boolean> {
    await connectDatabase()
    const courseDeactivated = await CourseModel.findOneAndUpdate({ id }, { active: false }, { new: true })
    return courseDeactivated !== null
  }
}
