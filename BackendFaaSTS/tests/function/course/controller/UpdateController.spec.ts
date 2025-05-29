import 'reflect-metadata'

import { type UpdateUseCase } from '@common/domain/UseCase.interface'
import { DuplicatedFieldError } from '@common/error/DuplicatedFieldError'
import { IDNotFoundError } from '@common/error/NotFoundError'
import { type Mapper } from '@common/mapper/BaseMapper'
import { type NewValidationSchema } from '@common/validation/Validate'
import { type CourseDTO } from '@functions/course/entities/dto/CourseDTO'
import { Course } from '@functions/course/entities/Course'
import { type CoursePresentationModel } from '@functions/course/entities/dto/CoursePM'
import { errorLabel } from '@functions/course/adapter/repository/MongoDB/utils'
import { UpdateCourseController } from '@functions/course/controller/UpdateController'

import { type MockProxy, mock } from 'jest-mock-extended'
import { type MongoServerError } from 'mongodb'

describe('UpdateNoticeController', () => {
  let templateDto: CourseDTO
  let templateCourse: Course
  let templatePresentation: CoursePresentationModel
  let systemUnderTest: UpdateCourseController
  let dtoValidator: MockProxy<NewValidationSchema>
  let dtoToEntityMapper: MockProxy<Mapper<CourseDTO, Course>>
  let entityToPresentationModelMapper: MockProxy<Mapper<Course, CoursePresentationModel>>
  let updateCourseUseCase: MockProxy<UpdateUseCase<Course>>
  let mockedError: MockProxy<MongoServerError>

  beforeAll(() => {
    mockedError = mock()
    mockedError.code = 11000
    mockedError.keyPattern = { any_field: 1 }
    templateDto = {
      name: 'any_name',
      acronym: 'any_acronym',
      active: true,
      code: 'any_code',
      coordinator: 'any_coordinator',
      schedule: ['Noturno']
    }
    templateCourse = new Course({ ...templateDto })
    templatePresentation = { ...templateCourse }
    dtoValidator = mock()
    dtoToEntityMapper = mock()
    dtoToEntityMapper.execute.mockResolvedValue(templateCourse)
    entityToPresentationModelMapper = mock()
    entityToPresentationModelMapper.execute.mockResolvedValue(templatePresentation)
    updateCourseUseCase = mock()
    updateCourseUseCase.execute.mockResolvedValue(templateCourse)
    systemUnderTest = new UpdateCourseController(dtoValidator, dtoToEntityMapper, entityToPresentationModelMapper, updateCourseUseCase)
  })

  it('should return 200 on useCase.update success', async () => {
    const result = await systemUnderTest.handle(templateDto, 'any_id')

    expect(result).toEqual({ statusCode: 200, data: templatePresentation })
  })

  it('should return 400 on useCases.update DuplicatedFieldError', async () => {
    updateCourseUseCase.execute.mockResolvedValueOnce(new DuplicatedFieldError({
      entity: templateCourse,
      errorLabel,
      mongoError: mockedError,
      possibleDuplicatedFields: 'any_field'
    }))

    const result = await systemUnderTest.handle(templateDto, 'any_id')

    expect(result).toEqual({ statusCode: 400, data: { field: 'any_field', message: 'Foram enviados dados duplicados!' } })
  })

  it('should return 400 on useCases.update NotFoundError', async () => {
    updateCourseUseCase.execute.mockResolvedValueOnce(new IDNotFoundError('any_id', 'any_entity'))

    const result = await systemUnderTest.handle(templateDto, 'any_id')

    expect(result).toEqual({ statusCode: 404, data: { field: 'ID', message: new IDNotFoundError('any_id', 'any_entity').message } })
  })

  it('should return 500 on useCases.update infra failure', async () => {
    updateCourseUseCase.execute.mockRejectedValueOnce(new Error('any_unexpected_error'))

    const result = await systemUnderTest.handle(templateDto, 'any_id')

    expect(result).toEqual({ statusCode: 500, data: 'Erro inesperado!' })
  })
})
