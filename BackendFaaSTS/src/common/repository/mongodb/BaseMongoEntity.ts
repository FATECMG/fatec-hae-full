import { type Document } from 'mongoose'

export interface IEntity extends Document {
  id: string
  active: boolean
}
