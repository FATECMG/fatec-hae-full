import type BaseEntity from '@common/entity/BaseEntity'

import { v4 as uuid } from 'uuid'

export interface NoticeCourse {
  id: string
  name: string
}

export interface NoticeProps {
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
}

export default class Notice implements BaseEntity {
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

  constructor (props: NoticeProps, id?: string) {
    this.id = id ?? uuid()
    this.title = props.title
    this.topicsOfInterest = props.topicsOfInterest
    this.description = props.description
    this.semester = props.semester
    this.year = props.year
    this.openDate = props.openDate
    this.evaluationEndDate = props.evaluationEndDate
    this.closeDate = props.closeDate
    this.active = props.active ?? true
    this.course = props.course
  }
}
