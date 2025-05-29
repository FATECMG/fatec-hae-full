import { injectable } from 'inversify'
import { Document, FilterQuery, model, Model, UpdateQuery } from 'mongoose'
import { warmConnections } from '../../../..'
import { IItemEntity } from '../../entities/item.entity'
import ItemSchema from '../../entities/item.schema'
import { IItemRepository } from './types'

@injectable()
export class ItemRepository implements IItemRepository {
  constructor() {
    warmConnections()
    this.collection = model('items', ItemSchema)
  }
  private collection: Model<IItemEntity & Document>
  async create(item: IItemEntity): Promise<IItemEntity> {
    return await this.collection.create(item)
  }

  async createMany(items: IItemEntity[]): Promise<IItemEntity[]> {
    const _items = await this.collection.insertMany(items)
    return _items.map(i => i._doc)
  }

  async update(
    filter: FilterQuery<IItemEntity>,
    update: UpdateQuery<IItemEntity>,
  ): Promise<IItemEntity> {
    const _item = await this.collection.findOneAndUpdate(filter, update, {
      new: true,
    })
    return _item
  }

  async findOne(
    filter: any,
    projection: any,
    populate?: any,
  ): Promise<IItemEntity> {
    const _item = await this.collection
      .findOne(filter, projection)
      .populate(populate)
      .lean()
      .exec()
    return _item
  }

  async patch(item: IItemEntity): Promise<IItemEntity> {
    const $inc: any = { 'stock.quantity': 0 }
    if (item.stock?.quantity) {
      $inc['stock.quantity'] = item.stock?.quantity
    }
    const itemStock: any = {}
    if (item.stock.available !== undefined) {
      itemStock['stock.available'] = item.stock.available
    }

    if (item.stock.totalQuantity !== undefined) {
      itemStock['stock.totalQuantity'] = item.stock.totalQuantity
      itemStock['stock.quantity'] = item.stock.totalQuantity
    }

    delete item.stock
    let _item = await this.collection
      .findByIdAndUpdate(
        item._id,
        {
          $set: {
            ...item,
            ...itemStock,
          },
        },
        {
          new: true,
        },
      )
      .lean()

    _item = await this.collection
      .findOneAndUpdate(
        {
          _id: item._id,
          $or: [
            {
              type: { $nin: ['Característico', 'Composto'] },
            },
            { type: 'Composto', stockControl: 'controlled' },
          ],
        },
        {
          $inc,
        },
        {
          new: true,
        },
      )
      .lean()
    return _item
  }

  async find(params: {
    filters: any
    offset: number
    limit: number
  }): Promise<IItemEntity[]> {
    const { filters, limit, offset } = params
    return await this.collection
      .find({ ...filters, active: true })
      .limit(limit)
      .skip(offset)
      .populate({ path: 'subItems.options.item complements.item' })
      .sort({ createdAt: -1 })
      .exec()
  }

  async count({ filters }: any): Promise<number> {
    return await this.collection.countDocuments({ ...filters, active: true })
  }
}
