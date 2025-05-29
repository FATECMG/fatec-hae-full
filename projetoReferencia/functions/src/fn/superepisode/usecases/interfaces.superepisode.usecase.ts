import { ISuperEpisode } from '../entities/interfaces'

export interface ICreateSuperEpisodeUseCase {
  create(superepisode: ISuperEpisode): Promise<ISuperEpisode>
}
