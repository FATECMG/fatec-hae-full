import { injectable } from 'inversify'
import { Document, model, Model, Schema } from 'mongoose'
import { warmConnections } from '../../../..'
import { EpisodeSchema } from '../../../episodes/adapters/repositories/episode.repository'
import { ICollaborator } from '../../entities/interfaces'
import { ICollaboratorRepository } from './interfaces'

export const CollaboratorSchema = new Schema(
  {
    name: String,
    episode: { type: Schema.Types.ObjectId, ref: 'episodes' },
    active: { type: Boolean, default: true },
    type: String,
    messagingToken: String,
  },
  { timestamps: true },
)

@injectable()
export class CollaboratorMongo implements ICollaboratorRepository {
  constructor() {
    this.collection = model('collaborators', CollaboratorSchema)
    model('episodes', EpisodeSchema)
  }

  private collection: Model<ICollaborator & Document>
  async findOne(
    filter: any,
    projection: string,
    populate?: any,
  ): Promise<ICollaborator> {
    warmConnections()
    const collaborator = await this.collection.findOne(filter, projection, {
      populate,
    })

    return collaborator
  }

  async create(collaborator: ICollaborator): Promise<ICollaborator> {
    warmConnections()
    const createdCollaborator = await this.collection.create(collaborator)
    return createdCollaborator
  }

  async update(collaboratorr: ICollaborator): Promise<ICollaborator> {
    warmConnections()
    const updatedCollaborator = await this.collection.findByIdAndUpdate(
      collaboratorr._id,
      {
        $set: collaboratorr,
      },
      { new: true },
    )

    return updatedCollaborator
  }

  async find(
    filter: any,
    projection?: string,
    populate?: any,
  ): Promise<ICollaborator[]> {
    warmConnections()
    const collaborators = await this.collection
      .find(filter, projection)
      .populate(populate)
      .exec()

    return collaborators
  }
}
