import 'reflect-metadata'

import { type MockProxy, mock } from 'jest-mock-extended'

import { type UpdateUseCase } from '@common/domain/UseCase.interface'
import { DuplicatedFieldError } from '@common/error/DuplicatedFieldError'
import { IDNotFoundError } from '@common/error/NotFoundError'
import { type Mapper } from '@common/mapper/BaseMapper'
import { type NewValidationSchema } from '@common/validation/Validate'
import { type MongoServerError } from 'mongodb'
import UpdateNoticeController from '@functions/notice/controller/Update'
import { type NoticeDTO, Notice, type NoticePM } from '@functions/notice/entities'
import { errorLabel } from '@functions/notice/adapter/repositories/MongoDB/utils/errorLabel'

describe('UpdateNoticeController', () => {
  let templateDto: NoticeDTO
  let templateNotice: Notice
  let templatePresentation: NoticePM
  let systemUnderTest: UpdateNoticeController
  let dtoValidator: MockProxy<NewValidationSchema>
  let dtoToEntityMapper: MockProxy<Mapper<NoticeDTO, Notice>>
  let entityToPresentationModelMapper: MockProxy<Mapper<Notice, NoticePM>>
  let updateNoticeUseCase: MockProxy<UpdateUseCase<Notice>>
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
    updateNoticeUseCase = mock()
    updateNoticeUseCase.execute.mockResolvedValue(templateNotice)
    systemUnderTest = new UpdateNoticeController(dtoValidator, dtoToEntityMapper, entityToPresentationModelMapper, updateNoticeUseCase)
  })

  it('should return 200 on useCase.update success', async () => {
    const result = await systemUnderTest.handle(templateDto, 'any_id')

    expect(result).toEqual({ statusCode: 200, data: templatePresentation })
  })

  it('should return 400 on useCases.update DuplicatedFieldError', async () => {
    updateNoticeUseCase.execute.mockResolvedValueOnce(new DuplicatedFieldError({
      entity: templateNotice,
      errorLabel,
      mongoError: mockedError,
      possibleDuplicatedFields: 'any_field'
    }))

    const result = await systemUnderTest.handle(templateDto, 'any_id')

    expect(result).toEqual({ statusCode: 400, data: { field: 'any_field', message: 'Foram enviados dados duplicados!' } })
  })

  it('should return 400 on useCases.update NotFoundError', async () => {
    updateNoticeUseCase.execute.mockResolvedValueOnce(new IDNotFoundError('any_id', 'any_entity'))

    const result = await systemUnderTest.handle(templateDto, 'any_id')

    expect(result).toEqual({ statusCode: 404, data: { field: 'ID', message: new IDNotFoundError('any_id', 'any_entity').message } })
  })

  it('should return 500 on useCases.update infra failure', async () => {
    updateNoticeUseCase.execute.mockRejectedValueOnce(new Error('any_unexpected_error'))

    const result = await systemUnderTest.handle(templateDto, 'any_id')

    expect(result).toEqual({ statusCode: 500, data: 'Erro inesperado!' })
  })
})
