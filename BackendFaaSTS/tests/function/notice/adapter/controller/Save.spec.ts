import 'reflect-metadata'

import { type MockProxy, mock } from 'jest-mock-extended'
import { type MongoServerError } from 'mongodb'

import { type SaveUseCase } from '@common/domain/UseCase.interface'
import { type Mapper } from '@common/mapper/BaseMapper'
import { type NewValidationSchema } from '@common/validation/Validate'
import { DuplicatedFieldError } from '@common/error/DuplicatedFieldError'
import { ValidationError } from '@common/error/ValidationError'
import { errorLabel } from '@functions/notice/adapter/repositories/MongoDB/utils/errorLabel'
import SaveNoticeController from '@functions/notice/controller/Save'
import { type NoticeDTO, Notice, type NoticePM } from '@functions/notice/entities'

describe('SaveNoticeController', () => {
  let templateDto: NoticeDTO
  let templateNotice: Notice
  let templatePresentation: NoticePM
  let systemUnderTest: SaveNoticeController
  let dtoValidator: MockProxy<NewValidationSchema>
  let dtoToEntityMapper: MockProxy<Mapper<NoticeDTO, Notice>>
  let entityToPresentationModelMapper: MockProxy<Mapper<Notice, NoticePM>>
  let saveNoticeUseCase: MockProxy<SaveUseCase<Notice>>
  let mockedError: MockProxy<MongoServerError>

  beforeAll(() => {
    mockedError = mock()
    mockedError.code = 11000
    mockedError.keyPattern = { any_field: 1 }
    templateDto = {
      title: 'any_title',
      description: 'any_description',
      openDate: 'any_openDate',
      closeDate: 'any_closeDate',
      evaluationEndDate: 'any_evaluationEndDate',
      semester: 'any_semester',
      year: 'any_year',
      topicsOfInterest: ['any_topicOfInterest'],
      active: true
    }
    templateNotice = new Notice({ ...templateDto })
    templatePresentation = { ...templateNotice }
    dtoValidator = mock()
    dtoToEntityMapper = mock()
    dtoToEntityMapper.execute.mockResolvedValue(templateNotice)
    entityToPresentationModelMapper = mock()
    entityToPresentationModelMapper.execute.mockResolvedValue(templatePresentation)
    saveNoticeUseCase = mock()
    saveNoticeUseCase.execute.mockResolvedValue(templateNotice)
    systemUnderTest = new SaveNoticeController(dtoValidator, dtoToEntityMapper, entityToPresentationModelMapper, saveNoticeUseCase)
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
    saveNoticeUseCase.execute.mockResolvedValueOnce(new DuplicatedFieldError({
      entity: templateNotice,
      errorLabel,
      mongoError: mockedError,
      possibleDuplicatedFields: 'any_field'
    }))

    const result = await systemUnderTest.handle(templateDto)

    expect(result).toEqual({ statusCode: 400, data: { field: 'any_field', message: 'Foram enviados dados duplicados!' } })
  })

  it('should return 500 on useCases.save infra failure', async () => {
    saveNoticeUseCase.execute.mockRejectedValueOnce(new Error('any_unexpected_error'))

    const result = await systemUnderTest.handle(templateDto)

    expect(result).toEqual({ statusCode: 500, data: 'Erro inesperado!' })
  })
})
