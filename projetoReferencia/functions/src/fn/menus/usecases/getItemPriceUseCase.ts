import { inject, injectable } from 'inversify'
import { DomainError } from '../../../shared/errors/domain.error'
import { IMenuRepository } from '../adapters/repositories/types'
import { Locator } from '../shared/di.enums'

export interface IGetItemPriceUseCase {
  getItemPrice(itemPriceId: string, filters?: any): Promise<any>
}

@injectable()
export class GetItemPriceUseCase implements IGetItemPriceUseCase {
  constructor(@inject(Locator.MenuRepository) private repo: IMenuRepository) {}

  async getItemPrice(itemPriceId: string, filters?: any): Promise<any> {
    const menu = await this.repo.findOne(
      {
        ...filters,
        'itemsPrice._id': itemPriceId,
      },
      undefined,
      {
        path: 'itemsPrice.item',
        populate: [
          {
            path: 'subItems.options.item',
            select: 'name photos type',
          },
          {
            path: 'complements.item',
            select: 'name photos type',
          },
        ],
      },
    )

    if (!menu) {
      throw new DomainError({
        errorCode: '01 - menu_not_found',
        message: 'Não encontramos o menu',
      })
    }

    const itemPrice = menu.itemsPrice.find(
      (itp: any) => itp._id.toString() === itemPriceId,
    )

    return itemPrice
  }
}
