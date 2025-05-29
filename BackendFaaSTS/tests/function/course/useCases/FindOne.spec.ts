import 'reflect-metadata'

import { IDNotFoundError } from '@common/error/NotFoundError'
import { type FindOneEntityRepository } from '@common/repository/RepositoryInterface'

import { mock, type MockProxy } from 'jest-mock-extended'
import { type Course } from '@functions/course/entities/Course'
import { FindOneCourseUseCase } from '@functions/course/useCases/FindOne'

describe('FindOneCourseUseCase', () => {
  let templateCourse: Course
  let systemUnderTest: FindOneCourseUseCase
  let findOneCourseRepository: MockProxy<FindOneEntityRepository<Course>>

  beforeAll(() => {
    templateCourse = {
      id: 'any_id',
      name: 'any_name',
      acronym: 'any_acronym',
      code: 'any_code',
      coordinator: 'any_coordinator',
      schedule: ['any_schedule'],
      active: true
    }
    findOneCourseRepository = mock()
    systemUnderTest = new FindOneCourseUseCase(findOneCourseRepository)
  })

  it('should call FindOneCourseRepository with correct params', async () => {
    await systemUnderTest.execute('any_id')

    expect(findOneCourseRepository.perform).toHaveBeenCalledTimes(1)
    expect(findOneCourseRepository.perform).toHaveBeenCalledWith('any_id')
  })

  it('should returns a User when FindOneCourseRepository returns', async () => {
    findOneCourseRepository.perform.mockResolvedValueOnce(templateCourse)

    const result = await systemUnderTest.execute('any_id')

    expect(result).toEqual(templateCourse)
  })

  it('should returns a NotFoundError when FindOneCourseRepository returns undefined', async () => {
    findOneCourseRepository.perform.mockResolvedValueOnce(undefined)

    const result = await systemUnderTest.execute('any_id')

    expect(result).toEqual(new IDNotFoundError('any_id', 'curso'))
  })
})
