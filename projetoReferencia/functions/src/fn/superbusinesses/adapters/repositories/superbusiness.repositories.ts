import { Document, Model, model, Schema } from 'mongoose'
import { warmConnections } from '../../../..'
import { ISuperBusiness } from '../../entities/interfaces.entities'
import { ISuperBusinessRepository } from './interfaces.repositories'
import { DomainError } from '../../../../shared/errors/domain.error'
import { injectable } from 'inversify'

const SuperBusinessSchema = new Schema({
  name: String,
  email: String,
  firestoreUid: String,
  type: { type: String },
  active: Boolean,
})

@injectable()
export class SuperBusinessRepository implements ISuperBusinessRepository {
  constructor() {
    warmConnections()
    this._collection = model('businesses', SuperBusinessSchema)
  }
  private _collection: Model<ISuperBusiness & Document>
  async login(superBusiness: ISuperBusiness): Promise<ISuperBusiness> {
    const loggedSuperBusiness = await this._collection.findOne({
      firestoreUid: superBusiness.firestoreUid,
      type: 'SuperBusiness',
    })
    if (!loggedSuperBusiness) {
      throw new DomainError({
        errorCode: 'login-006',
        message: 'Requer elevação.',
      })
    } else if (!loggedSuperBusiness.active) {
      throw new DomainError({
        errorCode: 'login-007',
        message: 'Conta desativada.',
      })
    }
    return loggedSuperBusiness
  }
}
