import { Course } from '@functions/course/entities/Course'

export function toDomain (model: any): Course {
  return new Course({
    name: model.name,
    acronym: model.acronym,
    code: model.code,
    coordinator: model.coordinator,
    schedule: model.schedule,
    active: model.active
  }, model.id)
}
