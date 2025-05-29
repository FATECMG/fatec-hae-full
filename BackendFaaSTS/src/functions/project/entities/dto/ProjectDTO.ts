import { type AuthorDTO } from './AuthorDTO'
import { type ProjectNoticeDTO } from './ProjectNoticeDTO'

export interface ProjectDTOProps {
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
  proposedHours: string
  references: string
  complianceModel: string
  active?: boolean
}

export class ProjectDTO {
  author: AuthorDTO
  notice: ProjectNoticeDTO
  title: string
  description: string
  objectives: string
  methodology: string
  justification: string
  schedule: string
  sendDate?: string
  proposedHours: string
  references: string
  topicsOfInterest: string[]
  complianceModel: string
  status?: string
  active: boolean

  constructor (
    props: ProjectDTOProps) {
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
    this.proposedHours = props.proposedHours
    this.complianceModel = props.complianceModel
    this.topicsOfInterest = props.topicsOfInterest
    this.active = props.active ?? true
  }
}
