import type BaseEntity from '@common/entity/BaseEntity'

import { Status } from '@functions/project/entities/enums/ProjectEnums'
import { type Comment } from '@functions/comment/project/entities/Comment'

import { v4 as uuid } from 'uuid'
import { setComplianceModel } from '@common/validation/complianceValidator'
import { setStatus } from '@common/validation/statusValidator'

export interface ProjectProps {
  author: Author
  title: string
  notice: ProjectNotice
  description: string
  topicsOfInterest: string[]
  objectives: string
  methodology: string
  justification: string
  schedule: string
  references: string
  sendDate?: string
  hours: Hours
  complianceModel: string
  status?: string
  active: boolean
  comments: Comment[] | []
}

export interface Hours {
  approved?: string
  proposed: string
}

export interface ProjectNotice {
  id: string
  title: string
}

export interface ProjectReport {
  id: string
  title: string
}

export interface Author {
  id: string
  name: string
}

export class Project implements BaseEntity {
  id: string
  author: Author
  notice: ProjectNotice
  title: string
  description: string
  objectives: string
  methodology: string
  justification: string
  schedule: string
  references: string
  sendDate?: string
  hours: Hours
  topicsOfInterest: string[]
  complianceModel: string
  status: string
  active: boolean
  comments: Comment[]

  constructor (props: ProjectProps, id?: string, approvedHours?: string) {
    this.id = id ?? uuid()
    this.author = props.author
    this.notice = props.notice
    this.title = props.title
    this.description = props.description
    this.objectives = props.objectives
    this.methodology = props.methodology
    this.justification = props.justification
    this.schedule = props.schedule
    this.references = props.references
    this.sendDate = props.sendDate
    this.hours = props.hours
    this.hours.approved = approvedHours ?? 'EM ANÁLISE'
    this.complianceModel = setComplianceModel(props.complianceModel)
    this.topicsOfInterest = props.topicsOfInterest
    this.status = setStatus(props.status ?? Status.DRAFT)
    this.comments = props.comments ?? []
    this.active = props.active
  }
}
