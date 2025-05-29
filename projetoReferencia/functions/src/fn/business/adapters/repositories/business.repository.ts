import { injectable } from 'inversify'
import Repository, {
  ICountedList,
} from '../../../../shared/adapters/repositories/interfaces'
import { IBusinessRepository } from './interfaces.repository'
import { Schema, model, Model, Document, Types } from 'mongoose'
import { IBusiness } from '../../entities/interfaces.entity'
import { warmConnections } from '../../../..'
import { ILogin } from '../../../login/entities/interfaces'
import { ContractSchema } from '../../../contracts/adapters/repositories/contract.repository'

export const BusinessSchema: Schema = new Schema(
  {
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    name: {
      type: String,
      require: true,
    },
    firestoreUid: { type: String, require: true, unique: true },
    resourceToken: { type: String },
    paymentId: { type: String },
    paymentPublicKey: { type: String },
    document: {
      id: { type: String },
      status: { type: String, default: 'AWAITING' },
    },
    selfie: {
      id: { type: String },
      status: { type: String, default: 'AWAITING' },
    },
    companyDoc: {
      id: { type: String },
      status: { type: String, default: 'AWAITING' },
    },
    createdBy: {
      text: String,
      user: { type: Types.ObjectId, ref: 'business' },
    },
    cnpj: { type: String },
    cpf: { type: String, unique: true },
    phone: { type: String, require: true },
    businessArea: { type: Number, default: 1003 },
    linesOfBusiness: { type: String, default: 'Bebidas e Porções' },
    companyType: { type: String, default: 'LTDA' },
    birthDate: { type: Date },
    photo: { type: String },
    type: { type: String },
    bank: {
      number: { type: String },
      account: { type: String },
      agency: { type: String },
    },
    address: {
      cep: { type: String },
      postCode: { type: String },
      number: { type: String },
      street: { type: String },
      neighborhood: { type: String },
      city: { type: String },
      state: { type: String },
      placeId: String,
    },
    creditcard: {
      creditCardId: String,
      last4CardNumber: String,
      expirationMonth: String,
      expirationYear: String,
    },
    customer_id: { type: String },
    contract: {
      type: Schema.Types.ObjectId,
      ref: 'contracts',
    },
    transfersHistory: [
      {
        transferDate: { type: Date },
        amount: { type: Number, default: 0 },
        status: { type: String },
      },
    ],
    active: { type: Boolean, default: true },
    episodes: [
      {
        type: Types.ObjectId,
        ref: 'episodes',
      },
    ],
  },
  { timestamps: true },
)

interface IBusinessDocument extends IBusiness, Document {}

@injectable()
export class BusinessRepository implements IBusinessRepository, Repository {
  constructor() {
    this._collection = model<IBusinessDocument>('businesses', BusinessSchema)
    model('contracts', ContractSchema)
  }
  private _collection: Model<IBusinessDocument, any>

  connect() {
    warmConnections()
  }

  public async checkAdminExists(id: string): Promise<IBusiness> {
    this.connect()
    const admin = await this._collection.findOne(
      { _id: id, type: 'Administrador' },
      'active type',
    )
    return admin
  }

  public async create(business: IBusiness): Promise<IBusiness> {
    this.connect()
    delete business.contract
    const createdBusiness = await this._collection.create(business)
    return createdBusiness
  }

  public async checkUserExistsByParams(params: {
    email: string
    cpf: string
  }): Promise<IBusiness> {
    this.connect()
    const user = await this._collection
      .findOne(
        {
          $or: [
            {
              cpf: params.cpf,
            },
            {
              email: params.email,
            },
          ],
        },
        'cpf email',
      )
      .exec()

    return user
  }

  public async checkBusinessExists(id: string): Promise<IBusiness> {
    await warmConnections()
    const admin = await this._collection.findOne(
      { _id: id, type: 'Business' },
      'active type',
    )
    return admin
  }

  public async loginUser(type: string, login: ILogin): Promise<IBusiness> {
    this.connect()
    const business = await this._collection
      .findOne({
        firestoreUid: login.firestoreUid,
        type,
      })
      .lean()
    return business
  }

  public async list(
    filters?: any,
    projection?: string,
    limit = 999,
    offset = 0,
    populate?: any,
  ): Promise<ICountedList<IBusiness>> {
    this.connect()
    model('contracts', ContractSchema)
    const users = await this._collection
      .find(filters, projection)
      .populate(populate)
      .limit(limit)
      .skip(offset)
      .exec()
    const total = await this._collection.countDocuments(filters)
    return {
      list: users,
      total,
      hasMore: total > limit + offset,
    }
  }

  public async findOne(
    id: string,
    projection?: string,
    populate?: any,
  ): Promise<IBusiness> {
    this.connect()
    const user = await this._collection.findById(id, projection, { populate })
    return user
  }

  public async update(id: string, data: IBusiness): Promise<IBusiness> {
    this.connect()
    const business = await this._collection.findOneAndUpdate(
      { _id: id },
      {
        $set: data,
      },
      { new: true, lean: true },
    )

    return business
  }

  async findOneByParams(
    filters?: any,
    projection?: string,
    populate?: string,
  ): Promise<IBusiness> {
    this.connect()
    const user = await this._collection
      .findOne(filters, projection)
      .populate(populate)
      .exec()
    return user
  }
}
