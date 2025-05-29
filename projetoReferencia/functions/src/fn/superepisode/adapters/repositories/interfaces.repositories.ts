import { ISuperEpisode } from '../../entities/interfaces'

export interface ISuperEpisodeRepository {
  create?: (superEpisode: ISuperEpisode) => Promise<ISuperEpisode>
}
