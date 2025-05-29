import type BaseEntity from '@common/entity/BaseEntity'
import { RoleEnum } from '@functions/user/entities/User'

import { v4 as uuid } from 'uuid'

type RoleProperties = {
  name: string
  active?: boolean
}

export class Role implements BaseEntity {
  id: string
  name: string
  active: boolean

  constructor (props: RoleProperties, id?: string) {
    this.id = id ?? uuid()
    this.name = props.name
    this.active = props.active ?? true
  }

  static isNotRestricted (role: string): boolean {
    if (role === RoleEnum.ADMINISTRATOR || role === RoleEnum.ACADEMICDIRECTOR || role === RoleEnum.DIRECTOR) return true
    else return false
  }

  static isRestricted (role: string): boolean {
    return !this.isNotRestricted(role)
  }
}
