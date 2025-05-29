import 'reflect-metadata'

import { type MockProxy, mock } from 'jest-mock-extended'
import { type MongoServerError } from 'mongodb'

import { type SaveUseCase } from '@common/domain/UseCase.interface'
import { type Mapper } from '@common/mapper/BaseMapper'
import { type NewValidationSchema } from '@common/validation/Validate'
import { DuplicatedFieldError } from '@common/error/DuplicatedFieldError'
import { ValidationError } from '@common/error/ValidationError'
import { errorLabel } from '@functions/course/adapter/repository/MongoDB/utils'
import { type CourseDTO } from '@functions/course/entities/dto/CourseDTO'
import { Course } from '@functions/course/entities/Course'
import { SaveCourseController } from '@functions/course/controller/SaveController'
import { type CoursePresentationModel } from '@functions/course/entities/dto/CoursePM'

describe('SaveCourseController', () => {
  let templateDto: CourseDTO
  let templateCourse: Course
  let templatePresentation: CoursePresentationModel
  let systemUnderTest: SaveCourseController
  let dtoValidator: MockProxy<NewValidationSchema>
  let dtoToEntityMapper: MockProxy<Mapper<CourseDTO, Course>>
  let entityToPresentationModelMapper: MockProxy<Mapper<Course, CoursePresentationModel>>
  let saveCourseUseCase: MockProxy<SaveUseCase<Course>>
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
    saveCourseUseCase = mock()
    saveCourseUseCase.execute.mockResolvedValue(templateCourse)
    systemUnderTest = new SaveCourseController(dtoValidator, dtoToEntityMapper, entityToPresentationModelMapper, saveCourseUseCase)
  })

  it('should return 201 on useCases.save success', async () => {
    const result = await systemUnderTest.handle(templateDto)

    expect(result).toEqual({ statusCode: 201, data: templatePresentation })
  })

  it('should return 400 on validator ValidationError', async () => {
    dtoValidator.validate.mockImplementationOnce(jest.fn(() => new ValidationError([{ field: 'any_field', message: 'any_error' }])))

    const result = await systemUnderTest.handle(templateDto)

    expect(result).toEqual({ statusCode: 400, data: [{ field: 'any_field', message: 'any_error' }] })
  })

  it('should return 400 on useCases.save DuplicatedFieldError', async () => {
    saveCourseUseCase.execute.mockResolvedValueOnce(new DuplicatedFieldError({
      entity: templateCourse,
      errorLabel,
      mongoError: mockedError,
      possibleDuplicatedFields: 'any_field'
    }))

    const result = await systemUnderTest.handle(templateDto)

    expect(result).toEqual({ statusCode: 400, data: { field: 'any_field', message: 'Foram enviados dados duplicados!' } })
  })

  it('should return 500 on useCases.save infra failure', async () => {
    saveCourseUseCase.execute.mockRejectedValueOnce(new Error('any_unexpected_error'))

    const result = await systemUnderTest.handle(templateDto)

    expect(result).toEqual({ statusCode: 500, data: 'Erro inesperado!' })
  })
})
