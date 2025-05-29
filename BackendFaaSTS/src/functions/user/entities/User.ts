import { type Email, type Password, type Phone, type RegisterNumber } from '@common/entity/valueObjects'
import type BaseEntity from '@common/entity/BaseEntity'

import { v4 as uuid } from 'uuid'

export type UserProps = {
  name: string
  email: Email
  password: Password
  phone: Phone
  courses?: UserCourse[]
  roles: string
  registerNumber: RegisterNumber
  active: boolean
  academicTitle: academicTitles
}

export type academicTitles = 'GRADUADO' | 'PÓS-GRADUADO' | 'MESTRADO' | 'DOUTORADO'

export type UserCourse = {
  id: string
  name: string
}

export const RoleEnum = {
  ADMINISTRATOR: 'ADMINISTRADOR',
  PROFESSOR: 'PROFESSOR',
  COORDINATOR: 'COORDENADOR',
  DIRECTOR: 'DIRETOR',
  ACADEMICDIRECTOR: 'DIRETOR ADMINISTRATIVO'
}

/**
 * @class
 * User class represents the user domain entity. A user could be a teacher, school director or school director.
 * Furthermore, it is used to carry user data between the repository and useCase layer.
 */
export class User implements BaseEntity {
  id: string
  name: string
  email: Email
  password: Password
  phone: Phone
  courses: UserCourse[]
  roles: string
  registerNumber: RegisterNumber
  active: boolean
  academicTitle: academicTitles

  constructor (userProps: UserProps, id?: string) {
    this.id = id ?? uuid()
    this.name = userProps.name
    this.email = userProps.email
    this.password = userProps.password
    this.phone = userProps.phone
    this.courses = userProps.courses ?? []
    this.registerNumber = userProps.registerNumber
    this.roles = userProps.roles
    this.active = userProps.active
    this.academicTitle = userProps.academicTitle
  }
}

export interface UserNameAndId {
  id: string
  name: string
}
