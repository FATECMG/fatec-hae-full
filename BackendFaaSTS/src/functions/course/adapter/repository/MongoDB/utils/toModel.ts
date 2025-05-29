import { type Course } from '@functions/course/entities/Course'
import { type CourseDocument } from '@functions/course/adapter/repository/MongoDB/model/CourseModel'

export function toModel (course: Course): CourseDocument {
  return {
    id: course.id,
    name: course.name,
    acronym: course.acronym,
    code: course.code,
    coordinator: course.coordinator,
    schedule: course.schedule,
    active: course.active
  }
}
