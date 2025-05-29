import { injectable } from 'inversify'
import { Schema, Model, Document, model, Types, FilterQuery } from 'mongoose'
import { warmConnections } from '../../../..'
import { DomainError } from '../../../../shared/errors/domain.error'
import { BusinessSchema } from '../../../business/adapters/repositories/business.repository'
import ItemSchema from '../../../items/entities/item.schema'
import MenuSchema from '../../../menus/entities/menu.schema'
import { IEpisode } from '../../entities/interfaces'
import { IEpisodeRepository } from './interfaces.repository'

export const EpisodeSchema = new Schema(
  {
    name: { type: String, require: true, default: 'Meu restaurante' },
    business: { type: Types.ObjectId, ref: 'businesses' },
    orderNumberCounter: { type: Number, default: 0 },
    printerType: {
      type: String,
      enum: ['80mm', '58mm'],
      default: '58mm',
    },
    orderIdleTime: Number,
    stockControlMode: {
      type: {
        type: String,
        enum: ['Controle Total', 'Controle Manual'],
        default: 'Controle Total',
      },
      minValueWarning: { type: Number },
    },
    stayingConfig: {
      type: {
        type: String,
        enum: ['Mesa Fixa', 'Atendimento Livre'],
        default: 'Mesa Fixa',
      },
    },
    orderTypes: [
      {
        type: String,
        default: ['Físico'],
      },
    ],
    paymentTypes: [
      {
        type: String,
        default: ['Cartão de Crédito', 'Cartão de Débito', 'Dinheiro'],
      },
    ],
    menus: [
      {
        type: Types.ObjectId,
        ref: 'menus',
      },
    ],
    daysOfWork: [
      {
        dayName: String,
        initialTime: { type: Date },
        finalTime: { type: Date },
      },
    ],
    hasCollabTip: { type: Boolean, default: false },
    qrcode: {
      dotStyle: { type: String, default: 'rounded' },
      dotColor: { type: String, default: '#5d3d91' },
    },
    active: { type: Boolean, default: true },
    paused: { type: Boolean, default: false },
    collaboratorsPassword: { type: String },
    enableDelivery: { type: Boolean, default: false },
    enableGrabAndGo: { type: Boolean, default: true },
    deliveryFees: [
      {
        maxDistance: Number,
        value: Number,
      },
    ],
    neighborhoodFees: [
      {
        neighborhood: String,
        value: Number,
      },
    ],
    address: {
      cep: { type: String },
      number: { type: Number },
      street: { type: String },
      neighborhood: { type: String },
      city: { type: String },
      state: { type: String },
      placeId: String,
      text: String,
    },
    superBusiness: { type: Types.ObjectId, ref: 'businesses' },
    color: String,
    logo: String,
    minValueOrder: Number,
    shortLink: String,
    ownLink: String,
    notifyMotoboyNewOrders: Boolean,
    notifyMotoboyOrdersReady: Boolean,
    pixKey: String,
    hasNotMap: Boolean,
    initialListMode: String,
    prepMessagingToken: String,
  },
  { timestamps: true },
)

@injectable()
export class EpisodeRepository implements IEpisodeRepository {
  constructor() {
    this.collection = model('episodes', EpisodeSchema)
    model('menus', MenuSchema)
    model('items', ItemSchema)
  }
  private collection: Model<IEpisode & Document>
  async create(episode: IEpisode): Promise<IEpisode> {
    warmConnections()
    try {
      const createdEpisode = await this.collection.create({
        ...episode,
        business: episode?.business?.id,
      })

      const businessCollection = model('business', BusinessSchema)
      await businessCollection.findByIdAndUpdate(episode.business.id, {
        $push: { episodes: createdEpisode },
      })
      return createdEpisode
    } catch (err) {
      console.error(err)
      throw new DomainError({
        errorCode: 'episode-001',
        message: 'Não conseguimos criar o evento.',
      })
    }
  }

  async findOne(
    filter: FilterQuery<IEpisode>,
    projection: any,
    populate?: any,
  ) {
    warmConnections()
    try {
      const ep = await this.collection
        .findOne(filter, projection)
        .populate(populate)
        .lean()

      if (!ep) throw new Error('episode not found')
      return ep as IEpisode
    } catch (err) {
      console.error(err)
      throw new DomainError({
        errorCode: 'episode-001',
        message: 'Não conseguimos encontrar o evento',
      })
    }
  }

  async updateById(
    id: string,
    set: any,
    populate?: any,
    inc?: any,
    pull?: any,
  ): Promise<IEpisode> {
    warmConnections()

    const updateBody: any = {
      $set: set,
    }
    if (inc) {
      updateBody.$inc = inc
      delete updateBody.$set
    }
    if (pull) {
      updateBody.$pull = pull
      delete updateBody.$set
      delete updateBody.$inc
    }
    try {
      return await this.collection
        .findByIdAndUpdate(id, updateBody, { new: true })
        .populate(populate)
        .exec()
    } catch (err) {
      console.error(err)
      throw new DomainError({
        errorCode: 'episode-002',
        message: 'Não conseguimos atualizar o evento.',
      })
    }
  }
}
