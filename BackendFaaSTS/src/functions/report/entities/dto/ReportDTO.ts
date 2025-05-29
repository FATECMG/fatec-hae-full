export interface ReportPropsDTO {
  activities: ActivitiesReportDTO[]
  projectId: string
}

export interface ActivitiesReportDTO {
  description: string
}

export class ReportDTO {
  activities: ActivitiesReportDTO[]
  sendDate?: string
  projectId: string

  constructor (props: ReportPropsDTO) {
    this.projectId = props.projectId
    this.activities = props.activities
  }
}
