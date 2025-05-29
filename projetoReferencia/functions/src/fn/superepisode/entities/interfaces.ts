import Entity from '../../../shared/entities/Entity'

export interface IEpisode extends Entity {
  name?: string
  logo?: string
}

export interface ISuperEpisode extends Entity {
  name?: string
  description?: string
  episodes?: Array<IEpisode>
  color?: string
}
