import type BaseEntity from '@common/entity/BaseEntity'

import { v4 as uuid } from 'uuid'

export interface CourseProps {
  name: string
  acronym: string
  code: string
  schedule: string[]
  coordinator: string
  active?: boolean
}
/**
 * @class
 * Course represent the course domain entity. Course is a generic term used to identify an educational course from a school.
 */
export class Course implements BaseEntity {
  active: boolean
  id: string
  name: string
  acronym: string
  code: string
  schedule: string[]
  coordinator: string

  constructor (props: CourseProps, id?: string) {
    this.id = id ?? uuid()
    this.active = props.active ?? true
    this.name = props.name
    this.acronym = props.acronym
    this.code = props.code
    this.schedule = props.schedule
    this.coordinator = props.coordinator
  }
}
