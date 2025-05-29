import { injectable } from 'inversify'
import { Document, Model, model, Schema, Types } from 'mongoose'
import { warmConnections } from '../../../..'
import { EpisodeSchema } from '../../../episodes/adapters/repositories/episode.repository'
import { ISuperEpisode } from '../../entities/interfaces'
import { ISuperEpisodeRepository } from './interfaces.repositories'

const SuperEpisodeSchema = new Schema({
  name: String,
  description: String,
  episodes: [
    {
      type: Types.ObjectId,
      ref: 'episodes',
    },
  ],
  color: String,
})

interface ISuperEpisodeDocument extends ISuperEpisode, Document {}

@injectable()
export class CreateSuperEpisodeMongo implements ISuperEpisodeRepository {
  constructor() {
    warmConnections()
    this._collection = model<ISuperEpisodeDocument>(
      'superepisodes',
      SuperEpisodeSchema,
    )
    model('episodes', EpisodeSchema)
  }

  private _collection: Model<ISuperEpisodeDocument, any>
  async create(superEpisode: ISuperEpisode): Promise<ISuperEpisode> {
    let createdSuperEpisode = await this._collection.create(superEpisode)
    createdSuperEpisode = await createdSuperEpisode
      .populate('episodes', 'name logo color category')
      .execPopulate()
    return createdSuperEpisode
  }
}
