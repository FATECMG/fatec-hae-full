import Dinero from 'dinero.js'
import { IOrder } from '../../fn/orders/entities/interfaces'

export function dineroFromFloat(float: number) {
  const amount = Math.round(float * 100)

  return Dinero({ amount })
}

export type ReducePrice = (
  acc: Dinero.Dinero,
  order: Record<string, any>,
) => Dinero.Dinero

export function reducePrice(acc: Dinero.Dinero, order: IOrder): Dinero.Dinero {
  return acc.add(dineroFromFloat(order.price))
}

export function reduceDeliveryFee(
  acc: Dinero.Dinero,
  order: IOrder,
): Dinero.Dinero {
  return acc.add(dineroFromFloat(order.deliveryFee?.value ?? 0))
}

export function reduceByAnyAttribute(attribute: string): ReducePrice {
  return (acc: Dinero.Dinero, order: Record<string, any>) => {
    return acc.add(dineroFromFloat(order[attribute]))
  }
}
