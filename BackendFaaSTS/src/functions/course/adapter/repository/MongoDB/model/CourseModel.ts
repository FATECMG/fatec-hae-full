import { type CourseProps } from '@functions/course/entities/Course'

import mongoose, { Schema } from 'mongoose'
export interface CourseDocument extends CourseProps {
  id: string
}

/**
 * Course Schema modeled for MongoDB. Its schema is based on the ICourseDocument interface.
 * @see {@link CourseDocument}
 */
const courseSchema = new Schema<CourseDocument>({
  id: {
    type: 'string',
    required: true,
    unique: true
  },
  name: {
    type: 'string',
    required: true,
    unique: true
  },
  active: {
    type: 'boolean',
    required: true
  },
  code: {
    type: 'string',
    required: true,
    unique: true
  },
  coordinator: {
    type: 'string',
    required: true
  },
  acronym: {
    type: 'string',
    required: true
  },
  schedule: {
    type: ['string'],
    enum: ['Matutino', 'Vespertino', 'Noturno'],
    required: true
  }

})
/**
 * Model created based on the Course Schema.
 * It is used to execute CRUD operations in the Course collection.
 * @see {@link courseSchema}
 */
export const CourseModel = mongoose.model<CourseDocument>('course', courseSchema)
