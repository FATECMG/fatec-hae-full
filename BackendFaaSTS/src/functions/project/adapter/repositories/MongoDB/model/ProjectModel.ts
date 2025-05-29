import { type IEntity } from '@common/repository/mongodb/BaseMongoEntity'
import { type ProjectProps } from '@functions/project/entities/Project'

import mongoose, { Schema } from 'mongoose'

export interface IProjectDocument extends IEntity, ProjectProps {

}

const ProjectSchema = new Schema<IProjectDocument>({
  id: { type: 'string', required: true },
  notice: { type: Object, required: true },
  author: { type: Object, required: true },
  title: { type: 'string', required: true },
  active: { type: Boolean, required: true },
  objectives: { type: 'string', required: true },
  description: { type: 'string', required: true },
  topicsOfInterest: { type: ['string'], required: true },
  methodology: { type: 'string', required: true },
  justification: { type: 'string', required: true },
  schedule: { type: 'string', required: true },
  references: { type: 'string', required: true },
  sendDate: { type: 'string', required: false },
  hours: { type: Object, required: true },
  complianceModel: { type: 'string', required: true },
  status: { type: 'string', required: true },
  comments: [{ type: Object, required: true }]
})

export const ProjectModel = mongoose.model<IProjectDocument>('Project', ProjectSchema)
