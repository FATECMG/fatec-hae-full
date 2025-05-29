import { connectDatabase } from '@common/external/database/MongoDB'
import { type ActivateEntityRepository } from '@common/repository/RepositoryInterface'

import { type Course } from '@functions/course/entities/Course'
import { CourseModel } from '@functions/course/adapter/repository/MongoDB/model/CourseModel'

import { injectable } from 'inversify'

@injectable()
export class ActivateCourseMongoRepository implements ActivateEntityRepository<Course> {
  async perform (id: string): Promise<boolean> {
    await connectDatabase()
    const courseActivated = await CourseModel.findOneAndUpdate({ id }, { active: true }, { new: true })
    return courseActivated !== null
  }
}
