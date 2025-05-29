import Entity from '../../../shared/entities/Entity'

export interface ISuperBusiness extends Entity {
  email?: string
  password?: string
  firestoreUid?: string
  type?: string
  active?: boolean
}
