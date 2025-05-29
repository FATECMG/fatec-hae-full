import Entity from '../../../shared/entities/Entity'

export interface IAddress extends Entity {
  street?: string
  number?: string
  complement?: string
  neighborhood?: string
  city?: string
  state?: string
  postCode?: string
  cep?: string
  placeId?: string
  text?: string
}
