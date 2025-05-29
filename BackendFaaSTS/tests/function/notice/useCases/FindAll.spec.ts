import 'reflect-metadata'

import { mock, type MockProxy } from 'jest-mock-extended'

import { type FindAllEntityRepository } from '@common/repository/RepositoryInterface'
import { FindAllNoticeUseCase } from '@functions/notice/useCases/UseCases'
import { type Notice } from '@functions/notice/entities'

describe('FindAllNoticeRepository', () => {
  let systemUnderTest: FindAllNoticeUseCase
  let NoticeRepository: MockProxy<FindAllEntityRepository<Notice>>

  beforeAll(() => {
    NoticeRepository = mock()
    NoticeRepository.perform.mockResolvedValue([] as Notice[])
    systemUnderTest = new FindAllNoticeUseCase(NoticeRepository)
  })

  it('should return all Notices', async () => {
    const templateNotices: Notice[] = [
      {
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
      }]
    NoticeRepository.perform.mockResolvedValueOnce(templateNotices)

    const Notices = await systemUnderTest.execute(true)

    expect(Notices).toHaveLength(1)
    expect(Notices).toEqual(templateNotices)
  })

  it('should return an empty array if no Notice was found', async () => {
    const Notices = await systemUnderTest.execute(true)

    expect(Notices).toEqual([])
  })
})
