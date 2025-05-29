import { FilterQuery } from 'mongoose'
import { IEpisode } from '../../entities/interfaces'

export interface IEpisodeRepository {
  create?(episode: IEpisode): Promise<IEpisode>
  findOne(
    filter: FilterQuery<IEpisode>,
    projection?: any,
    populate?: any,
  ): Promise<IEpisode>
  updateById?(
    id: string,
    set: any,
    populate?: any,
    inc?: any,
    pull?: any,
  ): Promise<IEpisode>
}
