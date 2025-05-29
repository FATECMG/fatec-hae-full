import { type AuthorPM, type ProjectReportPM } from '@functions/project/entities/pm/ProjectPM'

export interface ReportPM {
  id: string
  author: AuthorPM
  project: ProjectReportPM
  activities: ActivitiesReportPM[]
  status: string
  active: boolean
  images?: string[]
}

export interface ActivitiesReportPM {
  description: string
}

export interface AttachmentReportPM {
  name: string
  url: string
  description: string
}
