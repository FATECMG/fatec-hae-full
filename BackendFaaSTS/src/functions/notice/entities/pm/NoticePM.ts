import { type NoticeCourse } from '@functions/notice/entities/Notice'

export interface NoticePMProps {
  id: string
  title: string
  topicsOfInterest: string[]
  description: string
  semester: string
  year: string
  openDate: string
  closeDate: string
  evaluationEndDate: string
  course?: NoticeCourse
  active: boolean
}

export default class NoticePM {
  id: string
  active: boolean
  title: string
  topicsOfInterest: string[]
  description: string
  semester: string
  year: string
  openDate: string
  closeDate: string
  evaluationEndDate: string
  course?: NoticeCourse

  constructor (props: NoticePMProps) {
    this.id = props.id
    this.title = props.title
    this.topicsOfInterest = props.topicsOfInterest
    this.description = props.description
    this.semester = props.semester
    this.year = props.year
    this.openDate = props.openDate
    this.closeDate = props.closeDate
    this.evaluationEndDate = props.evaluationEndDate
    this.active = props.active ?? true
    this.course = props.course
  }
}
