import Entity from '../../../shared/entities/Entity'
import { IEpisode } from '../../episodes/entities/interfaces'
export interface ILogin extends Entity {
  email?: string
  password?: string
  firestoreUid?: string
  jwt?: string
  publicKey?: string
  episode?: IEpisode
}
