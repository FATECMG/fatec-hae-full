import { Notice } from '@functions/notice/entities'
import { type NoticeProps } from '@functions/notice/entities/Notice'

jest.mock('uuid', () => ({ v4: () => 'any_id' }))

describe('Notice', () => {
  let noticeTemplate: NoticeProps

  beforeEach(() => {
    noticeTemplate = {
      title: 'any_title',
      topicsOfInterest: ['any_topicOfInterest'],
      description: 'any_description',
      semester: 'any_semester',
      year: 'any_year',
      openDate: 'any_openDate',
      closeDate: 'any_closeDate',
      evaluationEndDate: 'any_evaluationEndDate',
      active: true
    }
  })

  it('should create a new Notice with the data passed', () => {
    const notice = new Notice({ ...noticeTemplate })

    expect(notice).toEqual({
      id: 'any_id',
      title: 'any_title',
      topicsOfInterest: ['any_topicOfInterest'],
      description: 'any_description',
      semester: 'any_semester',
      year: 'any_year',
      openDate: 'any_openDate',
      closeDate: 'any_closeDate',
      evaluationEndDate: 'any_evaluationEndDate',
      active: true
    })
  })

  it('should create a new Notice with the data passed and active true by default when its is undefined', () => {
    const notice = new Notice({ ...noticeTemplate, active: undefined as any })
    expect(notice.active).toBe(true)
  })

  it('should create a new Notice with the data passed and active true by default when its is null', () => {
    const notice = new Notice({ ...noticeTemplate, active: null as any })
    expect(notice.active).toBe(true)
  })
  it('should create a new Notice with active false', () => {
    const notice = new Notice({ ...noticeTemplate, active: false })
    expect(notice.active).toEqual(false)
  })

  it('should create a new Notice with id passed', () => {
    const notice = new Notice({ ...noticeTemplate }, 'other_any_id')
    expect(notice.id).toBe('other_any_id')
  })

  it('should create a new Notice with topics passed', () => {
    const notice = new Notice({ ...noticeTemplate, topicsOfInterest: ['any_topicOfInterest', 'other_any_topicOfInterest'] })
    expect(notice.topicsOfInterest).toEqual(['any_topicOfInterest', 'other_any_topicOfInterest'])
  })
})
