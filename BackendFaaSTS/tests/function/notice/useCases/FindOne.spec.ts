import 'reflect-metadata'

import { mock, type MockProxy } from 'jest-mock-extended'

import { IDNotFoundError } from '@common/error/NotFoundError'
import { type FindOneEntityRepository } from '@common/repository/RepositoryInterface'
import { type Notice } from '@functions/notice/entities'
import { FindOneNoticeUseCase } from '@functions/notice/useCases/UseCases'

describe('FindOneNoticeUseCase', () => {
  let templateNotice: Notice
  let systemUnderTest: FindOneNoticeUseCase
  let findOneNoticeRepository: MockProxy<FindOneEntityRepository<Notice>>

  beforeAll(() => {
    templateNotice = {
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
    findOneNoticeRepository = mock()
    systemUnderTest = new FindOneNoticeUseCase(findOneNoticeRepository)
  })

  it('should call FindOneNoticeRepository with correct params', async () => {
    await systemUnderTest.execute('any_id')

    expect(findOneNoticeRepository.perform).toHaveBeenCalledTimes(1)
    expect(findOneNoticeRepository.perform).toHaveBeenCalledWith('any_id')
  })

  it('should returns a User when FindOneNoticeRepository returns', async () => {
    findOneNoticeRepository.perform.mockResolvedValueOnce(templateNotice)

    const result = await systemUnderTest.execute('any_id')

    expect(result).toEqual(templateNotice)
  })

  it('should returns a NotFoundError when FindOneNoticeRepository returns undefined', async () => {
    findOneNoticeRepository.perform.mockResolvedValueOnce(undefined)

    const result = await systemUnderTest.execute('any_id')

    expect(result).toEqual(new IDNotFoundError('any_id', 'edital'))
  })
})
