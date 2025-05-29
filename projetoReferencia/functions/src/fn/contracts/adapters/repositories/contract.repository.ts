import { injectable } from 'inversify'
import { Schema, Model, Document, model, FilterQuery } from 'mongoose'
import { warmConnections } from '../../../..'
import { DomainError } from '../../../../shared/errors/domain.error'
import { BusinessSchema } from '../../../business/adapters/repositories/business.repository'
import { IBusiness } from '../../../business/entities/interfaces.entity'
import PlansSchema from '../../../plans/entities/plan.schema'
import { IContract } from '../../entities/interfaces'
import { IContractRepository } from './interfaces'

const FEATURES = [
  'menu',
  'prepare_env',
  'delivery',
  'qrcode',
  'dash',
  'stock',
  'nfce',
  'neighborhoodFee',
  'shortLink',
]

export const ContractSchema = new Schema(
  {
    episode: { type: Schema.Types.ObjectId, ref: 'episodes' },
    features: [{ type: String, enum: FEATURES }],
    business: { type: Schema.Types.ObjectId, ref: 'businesses' },
    extraFeatures: [{ type: String, enum: FEATURES }],
    status: {
      type: String,
      enum: ['FREE', 'TRIAL', 'ACTIVE', 'CANCELED', 'PENDING', 'DISABLED'],
    },
    interactions: [
      {
        date: Date,
        description: String,
        source: String,
      },
    ],
    plan: {
      id: { type: Schema.Types.ObjectId, ref: 'plans' },
      name: String,
    },
    subscription: String,
    price: Number,
    discount: Number,
    nextBillingDate: Date,
    expireTrial: Date,
    cancelDate: Date,
    seller: { type: Schema.Types.ObjectId, ref: 'users' },
    active: { type: Boolean, default: true },
    lastPayment: Date,
    paymentError: {
      date: Date,
      message: String,
    },
  },
  { timestamps: true },
)

@injectable()
export class ContractRepository implements IContractRepository {
  constructor() {
    this.collection = model('contracts', ContractSchema)
  }
  private collection: Model<IContract & Document>
  private business: Model<IBusiness & Document>
  async create(contract: IContract): Promise<IContract> {
    warmConnections()
    const createdContract = await this.collection.create(contract)
    this.business = model('businesses', BusinessSchema)
    await this.business.findByIdAndUpdate(createdContract.business, {
      contract: createdContract,
    })
    return createdContract
  }

  async findOne(
    filter: FilterQuery<IContract>,
    projection?: any,
    populate?: any,
  ): Promise<IContract> {
    model('businesses', BusinessSchema)
    model('plans', PlansSchema)
    warmConnections()
    try {
      return await this.collection
        .findOne(filter, projection)
        .populate(populate)
        .lean()
        .exec()
    } catch (err) {
      console.log(err)
      throw new DomainError({
        errorCode: 'contract-001',
        message: 'Erro ao buscar contrato',
      })
    }
  }

  async list(
    filter?: any,
    projection?: string,
    populate?: any,
  ): Promise<Array<IContract>> {
    const contracts = await this.collection
      .find(filter, projection)
      .populate(populate)
      .lean()
      .exec()

    return contracts
  }

  async updateMany(
    filter: any,
    set: any,
    populate: any,
  ): Promise<Array<IContract>> {
    await this.collection
      .updateMany(filter, {
        $set: set,
      })
      .populate(populate)
      .lean()
      .exec()

    return []
  }

  async updateById(id: string, set: any, populate?: any): Promise<IContract> {
    const contract = await this.collection
      .findByIdAndUpdate(id, { $set: set }, { new: true })
      .populate(populate)
      .lean()
      .exec()

    return contract
  }
}
