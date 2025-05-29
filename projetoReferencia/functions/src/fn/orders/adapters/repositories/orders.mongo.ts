import { injectable } from 'inversify'
import { Document, FilterQuery, model, Model, Schema } from 'mongoose'
import { warmConnections } from '../../../..'
import { EpisodeSchema } from '../../../episodes/adapters/repositories/episode.repository'
import { IOrder, OrderItem } from '../../entities/interfaces'
import { IOrdersRepository } from './interfaces'
import Dinero from 'dinero.js'
import { CollaboratorSchema } from '../../../collaborators/adapters/repositories/collaboratorMongo'
import { BusinessSchema } from '../../../business/adapters/repositories/business.repository'

export const OrderSchema = new Schema(
  {
    discount: { type: Number },
    price: { type: Number, require: true },
    episode: { type: Schema.Types.ObjectId, ref: 'episodes' },
    orderItems: [
      {
        groupId: { type: String },
        name: { type: String },
        price: { type: Number },
        description: { type: String },
        type: { type: String },
        quantity: { type: Number },
        hasPhotos: { type: Boolean },
        observation: String,
        photos: [{ type: String }],
        status: { type: String, default: 'Aguardando' },
        prepareEnv: { type: String, enum: ['Cozinha', 'Bar'] },
        itemRef: { type: Schema.Types.ObjectId, ref: 'items' },
        stockControl: String,
        label: String,
        alias: String,
        options: [
          {
            name: String,
            observation: String,
            description: { type: String },
            hasPhotos: { type: Boolean },
            photos: [{ type: String }],
            alias: String,
            price: { type: Number },
            prepareEnv: { type: String, enum: ['Cozinha', 'Bar'] },
            itemRef: { type: Schema.Types.ObjectId, ref: 'items' },
            type: { type: String },
          },
        ],
        complements: [
          {
            quantity: { type: Number, default: 0 },
            name: { type: String },
            description: { type: String },
            hasPhotos: { type: Boolean },
            alias: String,
            photos: [{ type: String }],
            price: { type: Number },
            prepareEnv: { type: String, enum: ['Cozinha', 'Bar'] },
            itemRef: { type: Schema.Types.ObjectId, ref: 'items' },
            type: { type: String },
          },
        ],
      },
    ],
    deliveryType: String,
    deliveryAddress: {
      text: String,
      placeId: String,
    },
    deliveryFee: {
      deliveryFeeRef: { type: Schema.Types.ObjectId },
      value: Number,
    },
    hasCollabTip: { type: Boolean, default: false },
    collabTip: { type: Number, default: 0.1 },
    status: { type: String },
    orderNumber: { type: Number },
    orderTime: { type: Number }, // TIME IN minutes
    active: { type: Boolean, default: true },
    paymentType: { type: String, default: 'Cartão de Crédito' },
    change: { type: Number },
    type: { type: String, default: 'Físico' },
    customer: {
      name: { type: String },
      address: {
        postCode: { type: String },
        number: { type: String },
        street: { type: String },
        neighborhood: { type: String },
        city: { type: String },
        state: { type: String },
      },
      cpf: { type: String },
      phone: { type: String },
    },
    observation: { type: String },
    collaborator: { type: Schema.Types.ObjectId, ref: 'collaborators' },
    deliveryCollaborator: { type: Schema.Types.ObjectId, ref: 'collaborators' },
    tableNumber: { type: String },
    zelpaycard: { type: Number },
    paymentSplit: [
      {
        type: { type: String, default: 'Cartão de Crédito' },
        value: { type: Number, default: 0 },
      },
    ],
    nfce: { type: Schema.Types.ObjectId, ref: 'nfces' },
    messagingToken: String,
    approvedAt: Date,
    canceledAt: Date,
    readyAt: Date,
    finishedAt: Date,
    traveledAt: Date,
    source: String,
    travelTime: String,
    wasUpdated: Boolean,
    deliveryTime: Number,
  },
  { timestamps: true },
)

@injectable()
export class OrdersMongo implements IOrdersRepository {
  constructor() {
    this.collection = model('orders', OrderSchema)
    model('episodes', EpisodeSchema)
    model('collaborators', CollaboratorSchema)
    model('businesses', BusinessSchema)
  }

  private collection: Model<IOrder & Document>

  async getById(
    _id: string,
    projection?: string,
    populate?: any,
  ): Promise<IOrder> {
    warmConnections()
    const order = await this.collection
      .findById(_id, projection, { populate })
      .lean()
      .exec()
    return order
  }

  async list(
    filter: FilterQuery<IOrder>,
    projection?: string,
    populate?: any,
  ): Promise<Array<IOrder>> {
    warmConnections()
    const { limit, offset, sort } = filter
    delete filter.limit
    delete filter.offset
    delete filter.sort
    const orders = await this.collection
      .find(filter, projection)
      .limit(limit)
      .skip(offset)
      .sort(sort)
      .populate(populate)
      .lean()

    return orders
  }

  async count(filter: any): Promise<number> {
    const total = await this.collection.countDocuments(filter)
    return total
  }

  private calculateOrderItemsTotalValue = (orderItems: OrderItem[]) => {
    return orderItems.reduce((acc, oi) => {
      const complementsTotal =
        oi.complements?.reduce((accComp, comp) => {
          return accComp + (comp.quantity > 0 ? comp.price * comp.quantity : 0)
        }, 0) || 0

      const optionsTotal =
        oi.options?.reduce((accOpt, opt) => {
          return accOpt + opt.price
        }, 0) || 0
      return Dinero({ amount: Math.round(acc * 100) })
        .add(Dinero({ amount: Math.round(oi.price * 100) }))
        .add(Dinero({ amount: Math.round(complementsTotal * 100) }))
        .add(Dinero({ amount: Math.round(optionsTotal * 100) }))
        .toUnit()
    }, 0)
  }

  async updateOrder(order: IOrder): Promise<IOrder> {
    const { orderItems } = order
    const toPush: Array<OrderItem> = []
    const toPull: Array<OrderItem> = []
    const toUpdate: Array<OrderItem> = []
    const $inc = { price: 0 }
    if (orderItems) {
      toPush.push(...orderItems.filter(orderItem => !orderItem._id))
      $inc.price = this.calculateOrderItemsTotalValue(toPush)
      if (toPush.length > 0) {
        order.status = 'Aguardando'
        order.wasUpdated = true
      }
      toPull.push(
        ...orderItems.filter(
          orderItem => orderItem._id && orderItem.status === 'Removido',
        ),
      )
      $inc.price -= this.calculateOrderItemsTotalValue(toPull)
      const collabTip = Dinero({ amount: Math.ceil($inc.price * 100) })
        .multiply(0.1)
        .toUnit()
      if (order.hasCollabTip && (toPush.length > 0 || toPull.length > 0)) {
        $inc.price += collabTip
      }
      order.collabTip += collabTip
      toUpdate.push(
        ...orderItems.filter(
          orderItem => orderItem._id && orderItem.status !== 'Removido',
        ),
      )
    }
    if (order.deliveryType === 'Delivery' && order.deliveryFee.value) {
      $inc.price += order.deliveryFee.value
    } else if (order.deliveryType === 'Retirada' && order.deliveryFee.value) {
      $inc.price -= order.deliveryFee.value
    }

    if (order.discount) {
      $inc.price -= order.discount
      if (order.discount <= 0) {
        order.discount = undefined
      }
    }
    delete order.orderItems
    delete order.price

    warmConnections()
    if (toPush.length > 0) {
      await this.collection
        .findByIdAndUpdate(order._id, {
          $push: { orderItems: { $each: toPush } },
        })
        .exec()
    }

    if (toPull.length > 0) {
      await this.collection
        .findByIdAndUpdate(order._id, {
          $pull: { orderItems: { _id: { $in: toPull.map(oi => oi._id) } } },
        })
        .exec()
    }

    if (toUpdate.length > 0) {
      await this.collection
        .findOneAndUpdate(
          {
            _id: order._id,
            'orderItems._id': { $in: toUpdate.map(({ _id }) => _id) },
          },
          {
            $set: {
              'orderItems.$.status': toUpdate[0].status,
            },
          },
        )
        .exec()
    }

    const updatedOrder = this.collection
      .findByIdAndUpdate(
        order._id,
        {
          $inc,
          $set: order,
        },
        {
          new: true,
        },
      )
      .populate({ path: 'episode', select: 'name logo' })
      .lean()
      .exec()
    return updatedOrder
  }

  async createOrder(order: IOrder): Promise<IOrder> {
    warmConnections()
    return await this.collection.create(order)
  }

  async updateManyOrderItems(order: IOrder): Promise<IOrder> {
    warmConnections()
    return await this.collection.findOneAndUpdate(
      { _id: order._id },
      {
        $set: {
          orderItems: order.orderItems,
          status: order.status,
        },
      },
      { new: true },
    )
  }
}
