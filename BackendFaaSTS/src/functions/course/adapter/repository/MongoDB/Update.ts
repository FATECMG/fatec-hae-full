import { DuplicatedFieldError } from '@common/error/DuplicatedFieldError'
import { connectDatabase } from '@common/external/database/MongoDB'
import { isMongoDuplicationError } from '@common/utils/mongo/MongoErrorUtils'
import { type UpdateEntityRepository } from '@common/repository/RepositoryInterface'
import { EntityNotFoundByNameError, NotFoundError } from '@common/error/NotFoundError'

import { toDomain, errorLabel } from '@functions/course/adapter/repository/MongoDB/utils'
import { type Course } from '@functions/course/entities/Course'
import { CourseModel } from '@functions/course/adapter/repository/MongoDB/model/CourseModel'

import { injectable } from 'inversify'

type PossibleDuplicatedFields = 'name' | 'code'
let possibleDuplicatedFields: PossibleDuplicatedFields

@injectable()
export class UpdateCourseMongoRepository implements UpdateEntityRepository<Course> {
  async perform (course: Course, id: string): Promise<Course | undefined> {
    await connectDatabase()
    try {
      const updatedCourse = await CourseModel.findOneAndUpdate({ id }, {
        $set: {
          name: course.name,
          acronym: course.acronym,
          code: course.code,
          coordinator: course.coordinator,
          schedule: course.schedule,
          active: course.active
        }
      }, { new: true, runValidators: true })
      return updatedCourse === null ? undefined : toDomain(updatedCourse)
    } catch (error) {
      if (isMongoDuplicationError(error)) {
        throw new DuplicatedFieldError({
          mongoError: error,
          errorLabel,
          entity: course,
          possibleDuplicatedFields
        })
      }
      if (error instanceof NotFoundError) {
        throw new EntityNotFoundByNameError(error.fieldValue, error.entityName)
      }
      throw new Error('Erro inesperado ao atualizar curso!')
    }
  }
}
