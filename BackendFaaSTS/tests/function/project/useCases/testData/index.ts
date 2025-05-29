import { createStandardFormatDate } from '@common/utils/date/createStandardFormatDate'
import { Status } from '@functions/project/entities/enums/ProjectEnums'

const date = new Date()
export const actualDate = createStandardFormatDate(date)
export const futureDate = createStandardFormatDate(new Date(date.getFullYear(), date.getMonth() + 1, date.getDate()))
export const pastDate = createStandardFormatDate(new Date(date.getFullYear(), date.getMonth() - 1, date.getDate()))

export const baseTestProject = {
  id: 'any_id',
  title: 'any_title',
  description: 'any_description',
  justification: 'any_justification',
  references: 'any_references',
  objectives: 'any_objectives',
  methodology: 'any_methodology',
  complianceModel: 'any_complianceModel',
  topicsOfInterest: ['any_topic'],
  schedule: 'any_schedule',
  hours: {
    proposed: 'any_proposed_hours',
    approved: 'any_approved_hours'
  },
  notice: {
    id: 'any_notice_id',
    title: 'any_notice_title'
  },
  author: {
    id: 'any_author_id',
    name: 'any_author_name'
  },
  comments: [],
  active: false,
  status: Status.DRAFT
}

export const baseTestNotice = {
  id: 'any_id',
  title: 'any_title',
  topicsOfInterest: ['any_topic'],
  description: 'any_description',
  semester: 'any_semester',
  year: '2023',
  openDate: futureDate,
  closeDate: actualDate,
  evaluationEndDate: pastDate,
  active: true
}

export const restrictedRole = 'any_restricted_role'
export const anyRole = 'any_role'
