
import { type AuthorDTO } from './AuthorDTO'
import { type HoursDTO } from './HoursDTO'
import { type ProjectNoticeDTO } from './ProjectNoticeDTO'

export interface ProjectUpdateDTOProps {
  author: AuthorDTO
  notice: ProjectNoticeDTO
  title: string
  description: string
  topicsOfInterest: string[]
  objectives: string
  methodology: string
  justification: string
  schedule: string
  sendDate?: string
  hours: HoursDTO
  references: string
  complianceModel: string
  status: string
  active?: boolean
}

export class ProjectUpdateDTO {
  author: AuthorDTO
  notice: ProjectNoticeDTO
  title: string
  description: string
  objectives: string
  methodology: string
  justification: string
  schedule: string
  sendDate?: string
  hours: HoursDTO
  references: string
  topicsOfInterest: string[]
  complianceModel: string
  status: string
  active: boolean

  constructor (
    props: ProjectUpdateDTOProps) {
    this.author = props.author
    this.notice = props.notice
    this.title = props.title
    this.description = props.description
    this.objectives = props.objectives
    this.methodology = props.methodology
    this.justification = props.justification
    this.references = props.references
    this.schedule = props.schedule
    this.sendDate = props.sendDate
    this.hours = props.hours
    this.complianceModel = props.complianceModel
    this.topicsOfInterest = props.topicsOfInterest
    this.status = props.status
    this.active = props.active ?? true
  }
}
