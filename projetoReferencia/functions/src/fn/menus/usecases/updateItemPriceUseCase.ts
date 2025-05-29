import { inject, injectable } from 'inversify'
import { DomainError } from '../../../shared/errors/domain.error'
import { IMenuRepository } from '../adapters/repositories/types'
import { IMenuEntity } from '../entities/menu.entity'
import { Locator } from '../shared/di.enums'

export interface IUpdateItemPriceUseCase {
  updateItemPrice(menu: IMenuEntity, filters?: any): Promise<IMenuEntity>
}

@injectable()
export class UpdateItemPriceUseCase implements IUpdateItemPriceUseCase {
  constructor(@inject(Locator.MenuRepository) private repo: IMenuRepository) {}

  async updateItemPrice(
    menu: IMenuEntity,
    filters?: any,
  ): Promise<IMenuEntity> {
    const { _id, itemsPrice } = menu
    const [itemPrice] = itemsPrice
    const loadedMenu = await this.repo.findOne({ _id }, 'itemsPrice')
    if (!loadedMenu) {
      throw new DomainError({
        errorCode: '01 - menu_not_found',
        message: 'Menu não encontrado',
      })
    }
    loadedMenu.itemsPrice = loadedMenu.itemsPrice.map((itp: any) => {
      if (itp._id.toString() === (itemPrice as any)._id.toString()) {
        return {
          ...itp,
          price: itemPrice.price,
          typesOfConsumption: itemPrice.typesOfConsumption,
        }
      }
      return itp
    })

    await this.repo.update(
      { _id },
      { $set: { itemsPrice: loadedMenu.itemsPrice } },
      undefined,
    )
    return menu
  }
}
