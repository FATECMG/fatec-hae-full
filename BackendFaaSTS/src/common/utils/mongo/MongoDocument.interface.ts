import type BaseEntity from '@common/entity/BaseEntity'
import { type Document } from 'mongoose'

export interface IDocument extends Document, BaseEntity {
  id: string
}
