import 'reflect-metadata'

import { type FindAllUseCase } from '@common/domain/UseCase.interface'
import { type Mapper } from '@common/mapper/BaseMapper'
import { FindAllCourseController } from '@functions/course/controller/FindAllController'
import { Course } from '@functions/course/entities/Course'
import { type CoursePresentationModel } from '@functions/course/entities/dto/CoursePM'

import { type MockProxy, mock } from 'jest-mock-extended'

describe('FindAllCourseController', () => {
  let templateCourse: Course
  let systemUnderTest: FindAllCourseController
  let findAllUserUseCase: MockProxy<FindAllUseCase<Course>>
  let userToPresentationModelMapper: MockProxy<Mapper<Course, CoursePresentationModel>>

  beforeAll(() => {
    templateCourse = new Course({
      name: 'any_name',
      acronym: 'any_acronym',
      code: 'any_code',
      coordinator: 'any_coordinator',
      schedule: ['Noturno'],
      active: true
    })
    findAllUserUseCase = mock()
    findAllUserUseCase.execute.mockResolvedValue([templateCourse])
    userToPresentationModelMapper = mock()
    userToPresentationModelMapper.execute.mockResolvedValue({ ...templateCourse })
    systemUnderTest = new FindAllCourseController(userToPresentationModelMapper, findAllUserUseCase)
  })

  it('should return 200 on useCase success', async () => {
    const result = await systemUnderTest.handle(true)

    expect(result).toEqual({ statusCode: 200, data: [templateCourse] })
  })
})
