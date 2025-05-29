/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { injectable } from 'inversify'
import { Document, Model, model } from 'mongoose'
import { warmConnections } from '../../../..'
import { DomainError } from '../../../../shared/errors/domain.error'
import ItemSchema from '../../../items/entities/item.schema'
import { IMenuEntity } from '../../entities/menu.entity'
import MenuSchema from '../../entities/menu.schema'
import { populateDefaultItems } from './populates'
import { IMenuRepository } from './types'

@injectable()
export class MenuRepository implements IMenuRepository {
  constructor() {
    warmConnections()
    this.collection = model('menus', MenuSchema)
    model('items', ItemSchema)
  }
  private collection: Model<IMenuEntity & Document>
  async create(menu: IMenuEntity): Promise<IMenuEntity> {
    const _menu = await this.collection.create(menu)
    const menuPopulated = await _menu
      .populate({
        path: 'itemsPrice.item',
        select: 'photos name description stock',
      })
      .execPopulate()

    return menuPopulated
  }

  async find(params: {
    filters: any
    offset: number
    limit: number
  }): Promise<IMenuEntity[]> {
    const { filters, limit, offset } = params

    console.log(params)
    return await this.collection
      .find(filters)
      .populate({
        path: 'itemsPrice.item',
        select: 'photos name description stock type hasPhotos',
      })
      .limit(limit)
      .skip(offset)
      .sort({ createdAt: -1 })
      .exec()
  }

  async count({ filters }: any): Promise<number> {
    return await this.collection.countDocuments(filters)
  }

  async getMenuAndItems(menus: string[]): Promise<IMenuEntity[]> {
    try {
      return await this.collection
        .find({ _id: { $in: menus } })
        .populate(populateDefaultItems)
    } catch (err) {
      console.log(err)
      throw new DomainError({
        errorCode: 'menus-001',
        message: 'Erro ao buscar menus e itens',
      })
    }
  }

  async getMenuAndItemsAvailables(menus: string[]): Promise<IMenuEntity[]> {
    try {
      const populateOptions = { ...populateDefaultItems }
      populateOptions.match = { 'stock.available': true }
      return await this.collection
        .find({ _id: { $in: menus } })
        .populate(populateOptions)
    } catch (err) {
      console.log(err)
      throw new DomainError({
        errorCode: 'menus-001',
        message: 'Erro ao buscar menus e itens',
      })
    }
  }

  async findOne(
    filter: any,
    projection?: any,
    populate?: any,
  ): Promise<IMenuEntity> {
    const menu = await this.collection
      .findOne(filter, projection)
      .populate(populate)
      .lean()
      .exec()

    return menu
  }

  async updateMany(query: any, update: any): Promise<void> {
    try {
      await this.collection.updateMany(query, update)
    } catch (err) {
      console.log(err)
      throw new DomainError({
        errorCode: 'menus-001',
        message: 'Erro ao atualizar menus',
      })
    }
  }

  async update(query: any, update: any, options: any): Promise<IMenuEntity> {
    try {
      const updated = await this.collection.findOneAndUpdate(
        query,
        update,
        options,
      )

      return updated as IMenuEntity
    } catch (err) {
      console.log(err)
      throw new DomainError({
        errorCode: 'menus-001',
        message: 'Erro ao atualizar menus',
      })
    }
  }
}
