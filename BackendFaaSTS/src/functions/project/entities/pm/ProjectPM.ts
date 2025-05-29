import { type CommentPM } from '@functions/comment/project/entities/CommentPM'

export interface HoursPM {
  approved?: string
  proposed: string
}

export interface AuthorPM {
  id: string
  name: string
}

export interface ProjectNoticePM {
  id: string
  title: string
}

export interface ProjectReportPM {
  id: string
  title: string
}

export interface ProjectPM {
  id: string
  author: AuthorPM
  notice: ProjectNoticePM
  title: string
  description: string
  objectives: string
  methodology: string
  justification: string
  schedule: string
  references: string
  sendDate?: string
  hours: HoursPM
  topicsOfInterest: string[]
  complianceModel: string
  comments: CommentPM[]
  status: string
  active: boolean
}
