import { NoticeDTO } from '@functions/notice/entities'
import { type NoticeDTOProps } from '@functions/notice/entities/dto/NoticeDTO'

describe('Notice DTO', () => {
  let noticeTemplate: NoticeDTOProps

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

  it('should create a new NoticeDTO with the data passed', () => {
    const notice = new NoticeDTO({ ...noticeTemplate })

    expect(notice).toEqual({
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

  it('should return the same active value if its sent as \'true\'', () => {
    const notice = new NoticeDTO({ ...noticeTemplate, active: true })
    expect(notice.active).toBe(true)
  })

  it('should return the same active value if its sent as \'false\'', () => {
    const notice = new NoticeDTO({ ...noticeTemplate, active: true })
    expect(notice.active).toBe(true)
  })

  it('should create a new NoticeDTO with undefined active if it is not passed', () => {
    const notice = new NoticeDTO({ ...noticeTemplate, active: undefined as any })
    expect(notice.active).toBe(undefined)
  })

  it('should create a new NoticeDTO with null active if it is passed as \'null\'', () => {
    const notice = new NoticeDTO({ ...noticeTemplate, active: null as any })
    expect(notice.active).toBe(null)
  })
})
