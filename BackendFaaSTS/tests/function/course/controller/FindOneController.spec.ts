import 'reflect-metadata'

import { type FindOneUseCase } from '@common/domain/UseCase.interface'
import { type Mapper } from '@common/mapper/BaseMapper'
import { type CoursePresentationModel } from '@functions/course/entities/dto/CoursePM'
import { Course } from '@functions/course/entities/Course'
import { FindOneCourseController } from '@functions/course/controller/FindOneController'

import { mock, type MockProxy } from 'jest-mock-extended'

describe('FindOneCourseController', () => {
  let templateCourse: Course
  let templateCoursePM: CoursePresentationModel
  let systemUnderTest: FindOneCourseController
  let findOneUserUseCase: MockProxy<FindOneUseCase<Course>>
  let userToPresentationModelMapper: MockProxy<Mapper<Course, CoursePresentationModel>>

  beforeAll(() => {
    templateCoursePM = {
      id: 'any_id',
      name: 'any_name',
      acronym: 'any_acronym',
      active: true,
      code: 'any_code',
      coordinator: 'any_coordinator',
      schedule: ['Noturno']
    }
    templateCourse = new Course({ ...templateCoursePM })
    findOneUserUseCase = mock()
    findOneUserUseCase.execute.mockResolvedValue(templateCourse)
    userToPresentationModelMapper = mock()
    userToPresentationModelMapper.execute.mockResolvedValue(templateCoursePM)
    systemUnderTest = new FindOneCourseController(findOneUserUseCase, userToPresentationModelMapper)
  })

  it('should return 404 if no user was found', async () => {
    findOneUserUseCase.execute.mockResolvedValueOnce(new Error('any_error'))

    const promise = systemUnderTest.handle('any_id')

    await expect(promise).resolves.toEqual({
      statusCode: 404,
      data: 'any_error'
    })
  })

  it('should return 200 if user was found', async () => {
    const promise = systemUnderTest.handle('any_id')

    await expect(promise).resolves.toEqual({
      statusCode: 200,
      data: templateCoursePM
    })
  })
})
