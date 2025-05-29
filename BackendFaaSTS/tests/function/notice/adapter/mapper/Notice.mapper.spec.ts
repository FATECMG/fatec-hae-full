import 'reflect-metadata'

import { NoticeMapper, NoticePresentationModelMapper } from '@functions/notice/adapter/mapper'
import { Notice, NoticeDTO } from '@functions/notice/entities'

jest.mock('uuid', () => ({ v4: () => 'any_id' }))

describe('Notice Mapper', () => {
  let noticeTemplate: NoticeDTO
  beforeEach(async () => {
    noticeTemplate = {
      title: 'any_title',
      topicsOfInterest: ['any_topicOfInterest'],
      description: 'any_description',
      semester: 'any_semester',
      year: 'any_year',
      openDate: '20/01/2021',
      closeDate: '21/01/2021',
      evaluationEndDate: '22/01/2021',
      active: true
    }
  })

  it('should transform topicOfInterests to upperCase', async () => {
    const notice = await new NoticeMapper().execute(new NoticeDTO({ ...noticeTemplate }))
    expect(notice.topicsOfInterest).toEqual(['ANY_TOPICOFINTEREST'])
  })

  it('should map a NoticeDTO to a Notice with data passed', async () => {
    const notice = await new NoticeMapper().execute(new NoticeDTO({ ...noticeTemplate }))

    expect(notice).toEqual({
      id: 'any_id',
      title: 'ANY_TITLE',
      topicsOfInterest: ['ANY_TOPICOFINTEREST'],
      description: 'ANY_DESCRIPTION',
      semester: 'ANY_SEMESTER',
      year: 'ANY_YEAR',
      openDate: '20/01/2021',
      closeDate: '21/01/2021',
      evaluationEndDate: '22/01/2021',
      active: true
    })
  })
})

describe('Notice Presentation Mapper Mapper', () => {
  let noticeTemplate: NoticeDTO
  beforeEach(async () => {
    noticeTemplate = {
      title: 'any_title',
      topicsOfInterest: ['any_topicOfInterest'],
      description: 'any_description',
      semester: 'any_semester',
      year: 'any_year',
      openDate: '20/01/2021',
      closeDate: '21/01/2021',
      evaluationEndDate: '22/01/2021',
      active: true
    }
  })

  it('should map a Notice to a NoticePM with data passed', async () => {
    const notice = await new NoticePresentationModelMapper().execute(new Notice({ ...noticeTemplate }))
    expect(notice).toEqual({
      id: 'any_id',
      title: 'any_title',
      topicsOfInterest: ['any_topicOfInterest'],
      description: 'any_description',
      semester: 'any_semester',
      year: 'any_year',
      openDate: '20/01/2021',
      closeDate: '21/01/2021',
      evaluationEndDate: '22/01/2021',
      active: true
    })
  })
})
