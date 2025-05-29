/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { injectable } from 'inversify'
import { Model, Document, model } from 'mongoose'
import { warmConnections } from '../../../..'
import { IPlanEntity } from '../../entities/plan.entity'
import PlansSchema from '../../entities/plan.schema'
import { IPlanRepository } from './types'

@injectable()
export class PlanRepository implements IPlanRepository {
  constructor() {
    warmConnections()
    this.collection = model<IPlanEntity & Document>('plans', PlansSchema)
  }

  private collection: Model<IPlanEntity & Document>

  async find(): Promise<IPlanEntity[]> {
    return await this.collection.find({ active: true }).lean().exec()
  }

  async getOne(id: string, projection?: string): Promise<IPlanEntity> {
    const loadedPlan = await this.collection
      .findOne({ _id: id, active: true }, projection)
      .exec()
    return loadedPlan
  }

  async findOne(
    filter: any,
    projection?: string,
    populate?: any,
  ): Promise<IPlanEntity> {
    const loadedPlan = await this.collection
      .findOne(filter, projection)
      .populate(populate)
      .lean()
      .exec()

    return loadedPlan
  }
}
