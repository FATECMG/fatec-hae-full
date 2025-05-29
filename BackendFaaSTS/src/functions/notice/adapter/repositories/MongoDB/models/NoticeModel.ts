import { type IDocument } from '@common/utils/mongo/MongoDocument.interface'
import { type NoticeProps } from '@functions/notice/entities/Notice'
import mongoose, { Schema } from 'mongoose'

export interface INoticeDocument extends IDocument, NoticeProps {
  active: boolean
}

const NoticeSchema = new Schema<INoticeDocument>({
  id: { type: 'string', required: true, unique: true },
  title: { type: 'string', required: true, unique: true },
  active: { type: 'boolean', required: true },
  description: { type: 'string', required: true },
  openDate: { type: 'string', required: true },
  closeDate: { type: 'string', required: true },
  evaluationEndDate: { type: 'string', required: true },
  semester: { type: 'string', required: true },
  year: { type: 'string', required: true },
  topicsOfInterest: { type: ['string'], required: true },
  course: { type: Object }
})

export const NoticeModel = mongoose.model<INoticeDocument>('Notice', NoticeSchema)
