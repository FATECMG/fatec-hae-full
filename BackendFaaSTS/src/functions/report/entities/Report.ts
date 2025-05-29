import type BaseEntity from '@common/entity/BaseEntity'
import { setStatus } from '@common/validation/statusValidator'
import { type Author, type ProjectReport } from '@functions/project/entities/Project'
import { type Activity } from './Activity'
import { Status } from './enums/ReportEnums'

import { v4 as uuid } from 'uuid'

export interface ReportProps {
  author: Author
  project: ProjectReport
  activities: Activity[]
  course: string
  status?: string
  active: boolean
}

export class Report implements BaseEntity {
  author: Author
  project: ProjectReport
  activities: Activity[]
  course: string
  active: boolean
  status: string
  id: string

  constructor (props: ReportProps, id?: string) {
    this.id = id ?? uuid()
    this.author = props.author
    this.course = props.course
    this.project = props.project
    this.activities = props.activities
    this.active = props.active
    this.status = setStatus(props.status ?? Status.DRAFT)
  }
}
