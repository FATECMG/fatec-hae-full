import { isMongoDuplicationError } from '@common/utils/mongo/MongoErrorUtils'
import { DuplicatedFieldError } from '@common/error/DuplicatedFieldError'
import { connectDatabase } from '@common/external/database/MongoDB'
import { type SaveEntityRepository } from '@common/repository/RepositoryInterface'

import { type Course } from '@functions/course/entities/Course'
import { CourseModel } from '@functions/course/adapter/repository/MongoDB/model/CourseModel'
import { errorLabel, toModel } from '@functions/course/adapter/repository/MongoDB/utils'

import { injectable } from 'inversify'

type PossibleDuplicatedFields = 'name' | 'code'
let possibleDuplicatedFields: PossibleDuplicatedFields

@injectable()
export class SaveCourseMongoRepository implements SaveEntityRepository<Course> {
  async perform (course: Course): Promise<Course> {
    try {
      await connectDatabase()
      const newCourse = new CourseModel(toModel(course))
      await newCourse.save({ safe: true })
    } catch (err) {
      if (isMongoDuplicationError(err)) {
        throw new DuplicatedFieldError({
          mongoError: err,
          errorLabel,
          entity: course,
          possibleDuplicatedFields
        })
      }
      throw new Error('Erro inesperado ao salvar curso!')
    }
    return course
  }
}
