import 'reflect-metadata'

import { DuplicatedFieldError } from '@common/error/DuplicatedFieldError'
import { InfraError } from '@common/error/InfraError'
import { IDNotFoundError } from '@common/error/NotFoundError'
import { type UpdateEntityRepository } from '@common/repository/RepositoryInterface'
import { errorLabel } from '@functions/course/adapter/repository/MongoDB/utils'
import { type Course } from '@functions/course/entities/Course'
import { UpdateCourseUseCase } from '@functions/course/useCases/Update'

import { mock, type MockProxy } from 'jest-mock-extended'
import { type MongoServerError } from 'mongodb'

describe('UpdateCourseUseCase', () => {
  let systemUnderTest: UpdateCourseUseCase
  let courseRepository: MockProxy<UpdateEntityRepository<Course>>
  let mockedError: MockProxy<MongoServerError>
  let templateCourse: Course

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
    systemUnderTest = new UpdateCourseUseCase(courseRepository)
  })

  it('should call courseRepository.perform with correct params', async () => {
    await systemUnderTest.execute('any_id', templateCourse)

    expect(courseRepository.perform).toHaveBeenCalledTimes(1)
    expect(courseRepository.perform).toHaveBeenCalledWith(templateCourse, 'any_id')
  })

  it('should return a Course when repo returns', async () => {
    const result = await systemUnderTest.execute('any_id', templateCourse)

    expect(result).toEqual(templateCourse)
  })

  it('should return NotFoundError when courseRepository returns undefined', async () => {
    courseRepository.perform.mockResolvedValueOnce(undefined)

    const result = await systemUnderTest.execute('any_id', templateCourse)

    expect(result).toEqual(new IDNotFoundError('any_id', 'curso'))
  })

  it('should return DuplicateFieldError when courseRepository throws DuplicatedFieldError', async () => {
    courseRepository.perform.mockRejectedValueOnce(new DuplicatedFieldError({
      entity: templateCourse,
      errorLabel,
      mongoError: mockedError,
      possibleDuplicatedFields: 'any_field'
    }))

    const result = await systemUnderTest.execute('any_id', templateCourse)

    expect(result).toEqual(new DuplicatedFieldError({
      entity: templateCourse,
      errorLabel,
      mongoError: mockedError,
      possibleDuplicatedFields: 'any_field'
    }))
  })

  it('should return InfraError when courseRepository throws any other error', async () => {
    courseRepository.perform.mockRejectedValueOnce(new Error('any_error'))

    const result = await systemUnderTest.execute('any_id', templateCourse)

    expect(result).toEqual(new InfraError('Erro inesperado!'))
  })
})
