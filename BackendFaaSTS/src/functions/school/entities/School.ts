import type BaseEntity from '@common/entity/BaseEntity'

import { type Address } from '@functions/school/entities/Address'

import { v4 as uuid } from 'uuid'

export type SchoolProps = {
  active: boolean
  name: string
  address: Address
}
/**
 * @class
 * School represent the school domain entity. School is a generic term used to identify an educational institution.
 */
export class School implements BaseEntity {
  id: string
  active: boolean
  name: string
  address: Address

  constructor (props: SchoolProps, id?: string) {
    this.id = id ?? uuid()
    this.active = props.active
    this.name = props.name
    if (props.address.complement === null || props.address.complement === undefined) {
      props.address.complement = ''
    }
    if (props.address.number === null || props.address.number === undefined) {
      props.address.number = 'S/N'
    }
    this.address = props.address
  }
}
