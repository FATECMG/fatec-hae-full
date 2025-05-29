import 'reflect-metadata'

import { mock, type MockProxy } from 'jest-mock-extended'

import { type FindOneUseCase } from '@common/domain/UseCase.interface'
import { type Mapper } from '@common/mapper/BaseMapper'
import { Notice, type NoticePM } from '@functions/notice/entities'
import FindOneNoticeController from '@functions/notice/controller/FindOne'

describe('FindOneNoticeController', () => {
  let templateNotice: Notice
  let templateNoticePM: NoticePM
  let systemUnderTest: FindOneNoticeController
  let findOneUserUseCase: MockProxy<FindOneUseCase<Notice>>
  let userToPresentationModelMapper: MockProxy<Mapper<Notice, NoticePM>>

  beforeAll(() => {
    templateNoticePM = {
      id: 'any_id',
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
    templateNotice = new Notice({ ...templateNoticePM })
    findOneUserUseCase = mock()
    findOneUserUseCase.execute.mockResolvedValue(templateNotice)
    userToPresentationModelMapper = mock()
    userToPresentationModelMapper.execute.mockResolvedValue(templateNoticePM)
    systemUnderTest = new FindOneNoticeController(findOneUserUseCase, userToPresentationModelMapper)
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
      data: templateNoticePM
    })
  })
})
