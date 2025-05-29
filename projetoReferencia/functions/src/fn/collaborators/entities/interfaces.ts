import Entity from '../../../shared/entities/Entity'
import { IEpisode } from '../../episodes/entities/interfaces'

export interface ICollaborator extends Entity {
  name?: string
  active?: boolean
  type?: string
  episode?: IEpisode
  createdAt?: Date
  updatedAt?: Date
  messagingToken?: string
}
