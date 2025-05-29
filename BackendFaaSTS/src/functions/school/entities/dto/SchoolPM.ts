import { type Address } from '@functions/school/entities/Address'

export type SchoolPmProps = {
  id: string
  name: string
  address: Address
  active: boolean
}

/**
 * @class
 * Presentation model que será retornado para o recurso de escolas.
 */
export class SchoolPM {
  id: string
  name: string
  address: Address
  active: boolean

  constructor (props: SchoolPmProps) {
    this.id = props.id
    this.name = props.name
    this.address = props.address
    this.active = props.active
  }
}
