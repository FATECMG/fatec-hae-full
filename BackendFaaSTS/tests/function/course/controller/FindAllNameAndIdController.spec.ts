import 'reflect-metadata'

import { type FindAllUseCase } from '@common/domain/UseCase.interface'
import { FindAllCourseNameAndIdController } from '@functions/course/controller/FindAllNameAndIdController'
import { type Course } from '@functions/course/entities/Course'
import { type MockProxy, mock } from 'jest-mock-extended'
import { type CourseNameAndIdPM } from '@functions/course/entities/pm/CourseNameAndIdPM'
import { type Mapper } from '@common/mapper/BaseMapper'

describe('Find All Name And Id Controller', () => {
  let templateCourse: Course
  let templateCourseNameAndIdPM: CourseNameAndIdPM
  let systemUnderTest: FindAllCourseNameAndIdController
  let findAllUserUseCase: MockProxy<FindAllUseCase<Course>>
  let userToPresentationModelMapper: MockProxy<Mapper<Course, CourseNameAndIdPM>>

  beforeAll(() => {
    templateCourse = {
      id: 'any_id',
      name: 'any_name',
      acronym: 'any_acronym',
      code: 'any_code',
      coordinator: 'any_coordinator',
      schedule: ['Noturno'],
      active: true
    }
    templateCourseNameAndIdPM = {
      id: 'any_id',
      name: 'any_name'
    }
    findAllUserUseCase = mock()
    findAllUserUseCase.execute.mockResolvedValue([templateCourse])
    userToPresentationModelMapper = mock()
    userToPresentationModelMapper.execute.mockResolvedValue({ ...templateCourseNameAndIdPM })
    systemUnderTest = new FindAllCourseNameAndIdController(userToPresentationModelMapper, findAllUserUseCase)
  })

  it('should return 200 on useCase success', async () => {
    const result = await systemUnderTest.handle(true)

    expect(result).toEqual({ statusCode: 200, data: [templateCourseNameAndIdPM] })
  })
})
