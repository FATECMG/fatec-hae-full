import { IOrder } from '../entities/interfaces'

export interface UpdateContainer {
  order: IOrder
  who: { type: string; _id: string }
}

export interface Listing {
  hasMore?: boolean
  amount?: number
  orders: Array<IOrder>
}
export interface IOrdersUseCase {
  getOne?(order: IOrder, projection?: string): Promise<IOrder>
  cancelExpired?(order: IOrder): Promise<IOrder>
  listForCollab?(order: IOrder): Promise<Array<IOrder>>
  listForBusiness?(order: IOrder, filter?: any): Promise<Listing>
  updateOrderElevate?(container: UpdateContainer): Promise<IOrder>
  createOrder?(order: IOrder): Promise<IOrder>
  changeOrderItemStatus?(
    orderId: string,
    orderItemId: string,
    status: string,
  ): Promise<void>
  changeOrderItemsStatus?(
    orderId: string,
    orderItemsIds: string[],
    status: string,
  ): Promise<void>
}
