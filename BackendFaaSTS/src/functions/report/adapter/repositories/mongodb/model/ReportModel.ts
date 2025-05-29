import { type IEntity } from '@common/repository/mongodb/BaseMongoEntity'
import { type ReportProps } from '@functions/report/entities/Report'
import mongoose, { Schema } from 'mongoose'

export interface IReportDocument extends IEntity, ReportProps {}

const ReportSchema = new Schema<IReportDocument>({
  id: { type: 'string', required: true },
  author: { type: Object, required: true },
  project: { type: Object, required: true },
  activities: { type: [Object], required: true },
  course: { type: 'string', required: true },
  sendDate: { type: 'string', required: false },
  active: { type: Boolean, required: true },
  status: { type: 'string', required: true }
})

export const ReportModel = mongoose.model<IReportDocument>('Report', ReportSchema)
