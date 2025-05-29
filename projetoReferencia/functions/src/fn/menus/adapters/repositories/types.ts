/* eslint-disable @typescript-eslint/no-explicit-any */

import { IMenuEntity } from '../../entities/menu.entity'

export interface IMenuRepository {
  create: (menu: IMenuEntity) => Promise<IMenuEntity>
  find: (params: {
    filters: any
    offset: number
    limit: number
  }) => Promise<IMenuEntity[]>
  count: (params: any) => Promise<number>
  getMenuAndItems(menus: string[]): Promise<IMenuEntity[]>
  getMenuAndItemsAvailables(menus: string[]): Promise<IMenuEntity[]>
  findOne?(filter: any, projection?: any, populate?: any): Promise<IMenuEntity>
  updateMany?(filter: any, update: any): void
  update?(query: any, update: any, options: any): Promise<IMenuEntity>
}
