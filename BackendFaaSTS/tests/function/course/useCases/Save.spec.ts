import 'reflect-metadata'

import { DuplicatedFieldError } from '@common/error/DuplicatedFieldError'
import { InfraError } from '@common/error/InfraError'
import { type SaveEntityRepository } from '@common/repository/RepositoryInterface'
import { errorLabel } from '@functions/course/adapter/repository/MongoDB/utils'
import { type Course } from '@functions/course/entities/Course'
import { SaveCourseUseCase } from '@functions/course/useCases/Save'

import { mock, type MockProxy } from 'jest-mock-extended'
import { type MongoServerError } from 'mongodb'

describe('SaveCourseUseCase', () => {
  let templateCourse: Course
  let systemUnderTest: SaveCourseUseCase
  let courseRepository: MockProxy<SaveEntityRepository<Course>>
  let mockedError: MockProxy<MongoServerError>

  beforeAll(() => {
    mockedError = mock()
    mockedError.code = 11000
    mockedError.keyPattern = { any_field: 1 }
    templateCourse = {
      id: 'any_id',
      name: 'any_name',
      acronym: 'any_acronym',
      code: 'any_code',
      coordinator: 'any_coordinator',
      schedule: ['any_schedule'],
      active: true
    }
    courseRepository = mock()
    courseRepository.perform.mockResolvedValue(templateCourse)
    systemUnderTest = new SaveCourseUseCase(courseRepository)
  })

  it('should calls SaveCourseMongoRepository with correct params', async () => {
    await systemUnderTest.execute(templateCourse)

    expect(courseRepository.perform).toHaveBeenCalledTimes(1)
    expect(courseRepository.perform).toHaveBeenCalledWith(templateCourse)
  })

  it('should return a Course when repo returns', async () => {
    const result = await systemUnderTest.execute(templateCourse)

    expect(result).toEqual(templateCourse)
  })

  it('should return DuplicatedFieldError when Repo return DuplicatedFieldError', async () => {
    courseRepository.perform.mockRejectedValueOnce(new DuplicatedFieldError({
      entity: templateCourse,
      errorLabel,
      mongoError: mockedError,
      possibleDuplicatedFields: 'any_field'
    }))

    const result = await systemUnderTest.execute(templateCourse)

    expect(result).toEqual(new DuplicatedFieldError({
      entity: templateCourse,
      errorLabel,
      mongoError: mockedError,
      possibleDuplicatedFields: 'any_field'
    }))
  })

  it('should return InfraError when Repo throws unexpected error', async () => {
    courseRepository.perform.mockRejectedValueOnce(new Error('any_unexpected_error'))

    const result = await systemUnderTest.execute(templateCourse)

    expect(result).toEqual(new InfraError('Erro inesperado!'))
  })
})
