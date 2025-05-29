import { type NoticeCourse } from '@functions/notice/entities/Notice'

export interface NoticeDTOProps {
  title: string
  topicsOfInterest: string[]
  description: string
  semester: string
  year: string
  openDate: string
  closeDate: string
  evaluationEndDate: string
  active?: boolean
  course?: NoticeCourse
}

export default class NoticeDTO {
  title: string
  topicsOfInterest: string[]
  description: string
  semester: string
  year: string
  openDate: string
  closeDate: string
  evaluationEndDate: string
  course?: NoticeCourse
  active?: boolean

  constructor (props: NoticeDTOProps) {
    this.title = props.title
    this.topicsOfInterest = props.topicsOfInterest
    this.description = props.description
    this.semester = props.semester
    this.year = props.year
    this.openDate = props.openDate
    this.closeDate = props.closeDate
    this.evaluationEndDate = props.evaluationEndDate
    this.active = props.active
    this.course = props.course
  }
}
