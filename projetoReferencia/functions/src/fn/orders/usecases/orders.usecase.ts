import { inject, injectable } from 'inversify'
import { IExternal } from '../../../shared/adapters/external/interfaces.external'
import { validate } from '../../../shared/decorators/validate'
import { IEpisode } from '../../episodes/entities/interfaces'
import { IOrdersRepository } from '../adapters/repositories/interfaces'
import { IOrder } from '../entities/interfaces'
import { Locator } from '../shared/di.enums'
import { IOrdersUseCase, Listing, UpdateContainer } from './interfaces'
import { GetOneValidation } from './validations/getone.validation'
import { getTodayMorning, TZ } from '../../../shared/utils/dates'
import { DomainError } from '../../../shared/errors/domain.error'
import { IOrderUpdateNotificationArgs } from '../adapters/externals/orderUpdateNotificationExternal'
import { IMenuRepository } from '../../menus/adapters/repositories/types'
import { IItemEntity } from '../../items/entities/item.entity'
import { IContractRepository } from '../../contracts/adapters/repositories/interfaces'
import { IItemRepository } from '../../items/adapters/repositories/types'
import { ICollaboratorRepository } from '../../collaborators/adapters/repositories/interfaces'
import { ICollaborator } from '../../collaborators/entities/interfaces'
import { ICollaboratorUpdateNotificationArgs } from '../adapters/externals/collaboratorUpdateNotificationExternal'
import { IEpisodeRepository } from '../../episodes/adapters/repositories/interfaces.repository'
import { format, getHours, getMinutes, setHours, setMinutes } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import isWithinInterval from 'date-fns/isWithinInterval'
import { IMenuEntity } from '../../menus/entities/menu.entity'
import { v4 } from 'uuid'
import { utcToZonedTime } from 'date-fns-tz'

@injectable()
export class OrdersUseCase implements IOrdersUseCase {
  constructor(
    @inject(Locator.OrdersRepository) private repo: IOrdersRepository,
    @inject(Locator.PublishOrderExternal)
    private publisher: IExternal<IOrder, void>,
    @inject(Locator.OrderUpdateNotificationExternal)
    private notification: IExternal<IOrderUpdateNotificationArgs, void>,
    @inject(Locator.MenusRepository) private menuRepo: IMenuRepository,
    @inject(Locator.ContractRepository)
    private contractRepo: IContractRepository,
    @inject(Locator.ItemRepository)
    private itemRepo: IItemRepository,
    @inject(Locator.CollaboratorsRepository)
    private collabRepo: ICollaboratorRepository,
    @inject(Locator.CollaboratorUpdateNotificationExternal)
    private collabNotifier: IExternal<
      ICollaboratorUpdateNotificationArgs,
      void
    >,
    @inject(Locator.EpisodeRepository) private episodeRepo: IEpisodeRepository,
    @inject(Locator.PublishOrderCreationExternal)
    private orderCreationNotifier: IExternal<IOrder, void>,
  ) {}

  @validate(new GetOneValidation())
  async getOne(order: IOrder, projection?: string): Promise<IOrder> {
    const loadedOrder = await this.repo.getById(order._id, projection)
    return loadedOrder
  }

  async cancelExpired(order: IOrder): Promise<IOrder> {
    const loadedOrder = await this.repo.getById(
      order._id,
      'status episode messagingToken',
      {
        path: 'episode',
        select: 'name logo',
      },
    )
    if (loadedOrder.status === 'Aguardando') {
      loadedOrder.status = 'Cancelado'
      const ISONow = new Date().toISOString()
      loadedOrder.canceledAt = ISONow
      await (loadedOrder as any).save()
      const episode: IEpisode = { _id: loadedOrder.episode }
      loadedOrder.episode = episode
      await this.publisher.call(loadedOrder)
      await this.notification.call({
        order: loadedOrder,
        notificationTitle: 'Seu pedido foi cancelado 😭',
        notificationBody: `${loadedOrder.episode?.name} demorou muito para aceitar.`,
      })
    }
    return loadedOrder
  }

  async listForCollab(order: IOrder): Promise<Array<IOrder>> {
    const { status } = order
    let statusFilter: any = {}
    if (status) {
      statusFilter = { status }
    }

    const today = getTodayMorning()

    const orders = await this.repo.list(
      {
        episode: order.episode._id,
        ...statusFilter,
        $or: [{ createdAt: { $gte: today } }, { updatedAt: { $gte: today } }],
      },
      undefined,
      { path: 'collaborator' },
    )

    return orders
  }

  async updateOrderElevate(container: UpdateContainer): Promise<IOrder> {
    const { order, who } = container
    const loadedOrderWithEpisode = await this.repo.getById(
      order._id,
      'episode deliveryType deliveryFee approvedAt readyAt canceledAt finishedAt hasCollabTip collabTip deliveryTime',
      {
        path: 'episode',
        select:
          '_id deliveryFees business name notifyMotoboyNewOrders notifyMotoboyOrdersReady logo',
        populate: [
          {
            path: 'business',
            select: 'contract',
            populate: {
              path: 'contract',
              select: 'features extraFeatures',
            },
          },
          {
            path: 'menus',
            select: 'name itemsPrice',
            populate: {
              path: 'itemsPrice.item',
              match: {
                'stock.available': true,
              },
              select:
                'name stock photos type subItems complements prepareEnv isNotPodiumCalc alias stockControl',
              populate: [
                {
                  path: 'subItems.options.item',
                  match: {
                    'stock.available': true,
                  },
                  select:
                    'name stock photos type prepareEnv isNotPodiumCalc alias stockControl',
                },
                {
                  path: 'complements.item',
                  match: {
                    'stock.available': true,
                  },
                  select:
                    'name stock photos type prepareEnv isNotPodiumCalc alias stockControl',
                },
              ],
            },
          },
        ],
      },
    )

    const hasStockFeature = this.hasStockFeature(loadedOrderWithEpisode.episode)

    let collaborator: ICollaborator = who

    if (who && order.status && order.status === 'Transporte') {
      collaborator = await this.collabRepo.findOne(
        {
          _id: who?._id,
          episode: loadedOrderWithEpisode?.episode?._id,
          active: true,
        },
        'name type',
      )
      if (!collaborator) {
        throw new DomainError({
          errorCode: 'order-002',
          message: 'Colaborador não existe no evento',
        })
      } else {
        order.deliverCollaborator = collaborator
      }
    }

    if ((order as any).discountToRemove) {
      order.discount = -(order as any).discountToRemove
    }

    if (order.hasCollabTip === undefined) {
      order.hasCollabTip = loadedOrderWithEpisode.hasCollabTip
      order.collabTip = loadedOrderWithEpisode.collabTip
    }
    if ((order as any).itemsToAdd) {
      const toPush = (order as any).itemsToAdd
      const availableItems = this.getAvailableItems(
        loadedOrderWithEpisode.episode,
      )
      const partialOrder = this.buildPartialOrder(
        { items: toPush },
        availableItems,
      )
      if (hasStockFeature) {
        await this.removeFromStock(partialOrder.orderItems)
      }
      order.orderItems = partialOrder.orderItems
    }
    if ((order as any).itemsToRemove) {
      order.orderItems = (order as any).itemsToRemove.map((oi: any) => ({
        ...oi,
        status: 'Removido',
      }))
    }
    if ((order as any).itemsToUpdate) {
      order.orderItems = (order as any).itemsToUpdate
    }
    if (
      order.deliveryType === 'Delivery' ||
      order.deliveryType === 'Retirada'
    ) {
      if (loadedOrderWithEpisode.deliveryType !== order.deliveryType) {
        if (order.deliveryType === 'Delivery') {
          const {
            episode: { deliveryFees },
          } = loadedOrderWithEpisode
          if (deliveryFees && deliveryFees.length > 0) {
            const [innerLoadedDeliveryFee] = deliveryFees.filter(
              df => df._id.toString() === order.deliveryFee._id,
            )
            order.deliveryFee = innerLoadedDeliveryFee
          }
        } else if (order.deliveryType === 'Retirada') {
          order.deliveryFee = loadedOrderWithEpisode.deliveryFee
        }
      } else {
        delete order.deliveryType
        delete order.deliveryFee
      }
    }
    if (order.status === 'Preparando') {
      order.approvedAt = new Date()
    } else if (order.status === 'Pronto') {
      order.readyAt = new Date()
    } else if (order.status === 'Cancelado') {
      order.canceledAt = new Date()
    } else if (order.status === 'Finalizado') {
      order.finishedAt = new Date()
    } else if (order.status === 'Transporte') {
      order.traveledAt = new Date()
    }
    const updatedOrder = await this.repo.updateOrder(order)
    if (!updatedOrder) {
      throw new DomainError({
        errorCode: 'order-001',
        message: 'Pedido não encontrado.',
      })
    }
    let isNew = false
    if (order.status) {
      const { status } = order
      let notificationBody
      let notificationTitle
      notificationBody = notificationTitle = ''
      if (status === 'Preparando') {
        notificationTitle = 'Seu pedido começou a ser preparado 🔥'
        notificationBody = `${loadedOrderWithEpisode.episode?.name} deu inicio no seu pedido.`
        isNew = true
      } else if (status === 'Pronto') {
        notificationTitle = 'Seu pedido está pronto ✅'
        notificationBody = `${loadedOrderWithEpisode.episode?.name} terminou seu pedido.`
      } else if (status === 'Transporte') {
        notificationTitle = 'Seu pedido saiu para entrega 🛵'
        notificationBody = `Chegará em aproximadamente ${loadedOrderWithEpisode?.deliveryTime} minutos.`
      } else if (status === 'Finalizado') {
        notificationTitle = 'Seu pedido foi entregue 👌‍‍'
        notificationBody = `Algo deu errado? Fale com ${loadedOrderWithEpisode.episode?.name} pelo whatsapp.`
      } else if (status === 'Cancelado') {
        notificationTitle = 'Seu pedido cancelado 😭'
        notificationBody = `Saiba mais com ${loadedOrderWithEpisode.episode?.name} pelo whatsapp.`
      } else if (status === 'Aguardando') {
        notificationTitle = 'Seu pedido voltou para fila 🤔'
        notificationBody = `Aguarde mais um pouquinho.`
      }

      await this.publisher.call(updatedOrder)

      await this.notification.call({
        order: updatedOrder,
        notificationBody,
        notificationTitle,
      })

      if (
        loadedOrderWithEpisode.deliveryType === 'Delivery' &&
        isNew &&
        loadedOrderWithEpisode.episode.notifyMotoboyNewOrders
      ) {
        const motoboys = await this.collabRepo.find({
          episode: loadedOrderWithEpisode.episode._id,
          type: 'Motoboy',
        })

        if (motoboys && motoboys.length > 0) {
          notificationTitle = 'Chegou um novo pedido delivery 🛵'
          notificationBody = `${loadedOrderWithEpisode.episode?.name} deu inicio no preparo.`
          for (const moto of motoboys) {
            if (moto.messagingToken) {
              await this.collabNotifier.call({
                collaborator: moto,
                icon: loadedOrderWithEpisode.episode.logo,
                notificationBody,
                notificationTitle,
              })
            }
          }
        }
      }
    }

    return updatedOrder
  }

  private async removeFromStock(orderItems: any[] = []) {
    console.log('removeFromStock', orderItems)
    for (const orderItem of orderItems) {
      console.log(orderItem)
      if (orderItem.stockControl === 'controlled') {
        await this.itemRepo.patch({
          _id: orderItem.itemRef,
          stock: {
            quantity: -1,
          },
        })
      }

      if (orderItem.options) {
        for (const option of orderItem.options) {
          if (option.stockControl === 'controlled') {
            await this.itemRepo.patch({
              _id: option.itemRef,
              stock: {
                quantity: -1,
              },
            })
          }
        }
      }

      if (orderItem.complements) {
        for (const complement of orderItem.complements) {
          if (complement.stockControl === 'controlled') {
            await this.itemRepo.patch({
              _id: complement.itemRef,
              stock: {
                quantity: -complement.quantity,
              },
            })
          }
        }
      }
    }
  }

  async listForBusiness(order: IOrder, filter?: any): Promise<Listing> {
    const { startDate, endDate, limit, offset, search } = filter
    const limitInt = parseInt(limit)
    const offsetInt = parseInt(offset)
    const searchReg = new RegExp(`.*${search}.*`, 'gi')
    const searchNumber = parseInt(search)
    const searchFilter =
      search && search !== ''
        ? {
            $or: [
              {
                'customer.name': searchReg,
              },
              {
                'customer.phone': searchReg,
              },
              {
                orderNumber: isNaN(searchNumber) ? 0 : searchNumber,
              },
              {
                zelpaycard: isNaN(searchNumber) ? 0 : searchNumber,
              },
              { status: searchReg },
              { paymentType: searchReg },
            ],
          }
        : undefined
    const filterToApply: any = {
      episode: order.episode._id,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
      ...searchFilter,
      limit: isNaN(limitInt) ? undefined : limitInt,
      offset: isNaN(offsetInt) ? undefined : offsetInt,
      sort: { createdAt: -1 },
    }
    const orders = await this.repo.list(filterToApply, undefined, {
      path: 'collaborator',
      select: 'name',
    })
    delete filterToApply.limit
    delete filterToApply.offset
    delete filterToApply.sort
    const total = await this.repo.count(filterToApply)
    return {
      hasMore:
        total >
        (isNaN(limitInt) ? 0 : limitInt) + (isNaN(offsetInt) ? 0 : offsetInt),
      orders,
      amount: total,
    }
  }

  private hasStockFeature(episode: IEpisode) {
    const allFeatures = [
      ...episode.business.contract?.features,
      ...episode.business.contract?.extraFeatures,
    ]
    return allFeatures.includes('stock')
  }

  private itemShouldStay(item: any) {
    return item?.stockControl === 'uncontrolled' || item?.stock?.quantity > 0
  }

  private getAvailableItems(episode: IEpisode): any[] {
    const hasStockFeature = this.hasStockFeature(episode)
    return episode?.menus
      ?.flatMap((menu: any) => {
        return (menu as IMenuEntity).itemsPrice
          .filter(
            itemPrice =>
              itemPrice.item &&
              (!hasStockFeature || this.itemShouldStay(itemPrice.item)),
          )
          .map(itemPrice => {
            const item = itemPrice.item as IItemEntity

            // we don't need to use subItems and complements here
            // the payload will be slightly smaller
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { subItems, complements, ...restItem } = item
            const price = itemPrice.price

            //the following return groups the items, then the options
            //of each subItems and the complements
            return [
              {
                _id: item._id,
                price: price || 0,
                type: 'item',
                item: restItem,
              },
              ...(itemPrice.item as IItemEntity).subItems?.map(
                (subItem: any) => {
                  return subItem?.options
                    ?.filter(
                      (option: any) =>
                        itemPrice.item &&
                        (!hasStockFeature || this.itemShouldStay(option.item)),
                    )
                    ?.map((option: any) => {
                      return {
                        subItem: subItem._id,
                        isComposite: subItem.isComposite,
                        _id: option._id,
                        price: option.price || 0,
                        type: 'option',
                        item: option.item,
                      }
                    })
                },
              ),
              ...(itemPrice.item as IItemEntity).complements
                ?.filter(
                  comp =>
                    itemPrice.item &&
                    (!hasStockFeature || this.itemShouldStay(comp.item)),
                )
                ?.map((complement: any) => {
                  return {
                    _id: complement._id,
                    price: complement.price || 0,
                    type: 'complement',
                    item: complement.item,
                  }
                }),
            ]
          })
      })
      .flat(2)
  }

  private buildPartialOrder(
    order: any,
    availableItems: any[],
  ): Partial<IOrder> {
    return order.items?.reduce(
      (acc: any, item: any) => {
        //first calculate the base price of an item
        const itemToAdd = availableItems
          ?.filter(availableItem => availableItem.type === 'item')
          ?.find(availableItem => availableItem._id.toString() === item._id)

        if (!itemToAdd) {
          throw new DomainError({
            message: 'Item não encontrado',
            errorCode: '02 - item_not_found',
          })
        }

        //now, lets calculate the price of the options
        const optionsData = item.subItems?.reduce(
          (accSub: any, subItem: any) => {
            const loadedSubItems = availableItems?.filter(
              availableItem =>
                availableItem.subItem?.toString() === subItem._id,
            )

            if (!loadedSubItems || !loadedSubItems.length) {
              throw new DomainError({
                message: 'Subitem não encontrado',
                errorCode: '03 - subitem_not_found',
              })
            }

            const optionPrice = subItem.selectedOptions?.reduce(
              (accOption: any, option: any) => {
                const loadedOption = loadedSubItems.find(
                  opt => opt._id.toString() === option._id,
                )

                if (!loadedOption) {
                  throw new DomainError({
                    message: 'Opção não encontrada',
                    errorCode: '04 - option_not_found',
                  })
                }

                accOption.price = accOption.price + loadedOption.price
                if (loadedOption.isComposite) {
                  accSub.innerOptions.push({
                    photos: loadedOption.item.photos,
                    name: loadedOption.item.name,
                    price: loadedOption.price,
                    alias: loadedOption.item.alias,
                    stockControl: loadedOption.item.stockControl,
                    itemRef: loadedOption.item._id,
                    type: loadedOption.item.type,
                  })
                } else {
                  accSub.outerOptions.push({
                    photos: loadedOption.item.photos,
                    status: 'Aguardando',
                    groupId: v4(),
                    quantity: 1,
                    price: loadedOption.price,
                    name: loadedOption.item.name,
                    alias: loadedOption.item.alias,
                    isNotPodiumCalc: loadedOption.item.isNotPodiumCalc,
                    stockControl: loadedOption.item.stockControl,
                    prepareTime: loadedOption.item.prepareTime,
                    prepareEnv: loadedOption.item.prepareEnv,
                    label: 'Subitem',
                    type: loadedOption.item.type,
                    itemRef: loadedOption.item._id,
                  })
                }

                return accOption
              },
              { price: 0 },
            )

            accSub.price = accSub.price + optionPrice.price

            return accSub
          },
          {
            price: 0,
            outerOptions: [],
            innerOptions: [],
          },
        )

        //now, lets calculate the price of the complements
        const complementsData = item.complements?.reduce(
          (accComp: any, complement: any) => {
            const loadedComplement = availableItems?.find(
              availableItem => availableItem._id.toString() === complement._id,
            )

            if (!loadedComplement) {
              throw new DomainError({
                message: 'Complemento não encontrado',
                errorCode: '05 - complement_not_found',
              })
            }

            accComp.price += loadedComplement.price * complement.quantity
            accComp.complements.push({
              photos: loadedComplement.item.photos,
              name: loadedComplement.item.name,
              price: loadedComplement.price,
              alias: loadedComplement.item.alias,
              itemRef: loadedComplement.item._id,
              quantity: complement.quantity,
              stockControl: loadedComplement.item.stockControl,
              type: loadedComplement.item.type,
            })

            return accComp
          },
          {
            complements: [],
            price: 0,
          },
        )

        const currentPrice =
          itemToAdd.price + optionsData.price + complementsData.price

        acc.price = acc.price + currentPrice

        acc.orderItems.push(
          {
            photos: itemToAdd.item.photos,
            status: 'Aguardando',
            groupId: v4(),
            quantity: 1,
            price: itemToAdd.price,
            name: itemToAdd.item.name,
            alias: itemToAdd.item.alias,
            stockControl: itemToAdd.item.stockControl,
            isNotPodiumCalc: itemToAdd.item.isNotPodiumCalc,
            prepareTime: itemToAdd.item.prepareTime,
            prepareEnv: itemToAdd.item.prepareEnv,
            observation: item.observation,
            options: optionsData.innerOptions,
            complements: complementsData.complements,
            type: itemToAdd.item.type,
            label: itemToAdd.item.type === 'Composto' ? 'Composto' : undefined,
            itemRef: itemToAdd.item._id,
          },
          ...optionsData.outerOptions,
        )
        return acc
      },
      {
        price: 0,
        orderItems: [],
      },
    )
  }

  async createOrder(order: any): Promise<IOrder> {
    const loadedEpisode = await this.episodeRepo.findOne(
      {
        _id: order.episode._id,
      },
      'menus daysOfWork neighborhoodFees deliveryFees orderNumberCounter business prepMessagingToken logo',
      [
        {
          path: 'menus',
          select: 'name itemsPrice',
          populate: {
            path: 'itemsPrice.item',
            match: {
              'stock.available': true,
            },
            select:
              'name stock photos type subItems complements prepareEnv isNotPodiumCalc alias stockControl',
            populate: [
              {
                path: 'subItems.options.item',
                match: {
                  'stock.available': true,
                },
                select:
                  'name stock photos type prepareEnv isNotPodiumCalc alias stockControl',
              },
              {
                path: 'complements.item',
                match: {
                  'stock.available': true,
                },
                select:
                  'name stock photos type prepareEnv isNotPodiumCalc alias stockControl',
              },
            ],
          },
        },
        {
          path: 'business',
          select: 'contract',
          populate: {
            path: 'contract',
            select: 'features extraFeatures',
          },
        },
      ],
    )

    ////// CHECK IF STORE EXISTS //////

    if (!loadedEpisode) throw new Error('Loja não encontrada.')

    ////// CHECK STORE IS CLOSED USING DAYS OF WORKING LOGIC //////

    const now = utcToZonedTime(new Date(), TZ)
    const dayName = format(now, 'E', { locale: ptBR })
    const dayOfWork = loadedEpisode.daysOfWork?.find(dayOfWork =>
      Boolean(dayName.match(new RegExp(dayOfWork.dayName, 'gi'))),
    )

    if (!dayOfWork) {
      throw new DomainError({
        message: 'Loja fechou',
        errorCode: '01 - store_closed',
      })
    }

    const initial = utcToZonedTime(dayOfWork.initialTime, 'America/Sao_Paulo')
    const final = utcToZonedTime(dayOfWork.finalTime, 'America/Sao_Paulo')

    let initialTime = utcToZonedTime(new Date(), 'America/Sao_Paulo')
    let finalTime = utcToZonedTime(new Date(), 'America/Sao_Paulo')

    initialTime = setHours(initialTime, getHours(initial))
    initialTime = setMinutes(initialTime, getMinutes(initial))
    finalTime = setHours(finalTime, getHours(final))
    finalTime = setMinutes(finalTime, getMinutes(final))

    if (!isWithinInterval(now, { start: initialTime, end: finalTime })) {
      throw new DomainError({
        message: 'Loja fechou',
        errorCode: '01 - store_closed',
      })
    }

    ////// BUILD ALL ITEMS THAT ARE AVAILABLE TO BE PURCHASED //////

    const availableItems = this.getAvailableItems(loadedEpisode)

    ////// BUILD THE ORDER //////

    const partialOrder: any = this.buildPartialOrder(order, availableItems)

    const orderToRegister: any = { ...order, ...partialOrder }

    ////// CALCULATE DELIVERYFEE //////

    if (order.deliveryType === 'Delivery') {
      const fee =
        loadedEpisode.neighborhoodFees?.find(neighborhoodFee => {
          return neighborhoodFee._id.toString() === order.deliveryFee?._id
        }) ||
        loadedEpisode.deliveryFees?.find(deliveryFee => {
          return deliveryFee._id.toString() === order.deliveryFee?._id
        })

      if (!fee) {
        throw new DomainError({
          message: 'Frete não encontrado',
          errorCode: '06 - delivery_fee_not_found',
        })
      }

      orderToRegister.deliveryFee = {
        deliveryFeeRef: fee._id,
        value: fee.value,
      }
      orderToRegister.price = orderToRegister.price + fee.value
      orderToRegister.deliveryAddress = order.customer?.deliveryAddress
    }

    ////// CALCULATE COLLAB TIP //////
    if (order.collabTip) {
      let collabTip = partialOrder.price * 0.1
      collabTip = parseFloat(collabTip.toFixed(2))
      orderToRegister.hasCollabTip = true
      orderToRegister.collabTip = collabTip
      orderToRegister.price = orderToRegister.price + collabTip
    }

    orderToRegister.orderNumber = loadedEpisode.orderNumberCounter + 1
    orderToRegister.episode = loadedEpisode._id
    orderToRegister.status = 'Aguardando'
    orderToRegister.orderType = orderToRegister.orderType ?? 'Físico'
    orderToRegister.tableNumber = order.table

    delete orderToRegister.items

    const createdOrder = await this.repo.createOrder(orderToRegister)
    await this.episodeRepo.updateById(loadedEpisode._id, undefined, undefined, {
      orderNumberCounter: 1,
    })
    if (this.hasStockFeature(loadedEpisode)) {
      await this.removeFromStock(orderToRegister.orderItems)
    }

    await this.orderCreationNotifier.call({
      _id: createdOrder._id,
      status: createdOrder.status,
      episode: {
        _id: loadedEpisode._id,
        prepMessagingToken: loadedEpisode.prepMessagingToken,
        logo: loadedEpisode.logo,
      },
    })

    return createdOrder
  }

  async changeOrderItemStatus(
    orderId: string,
    orderItemId: string,
    status: string,
  ): Promise<void> {
    const order = await this.repo.getById(
      orderId,
      'orderItems collabTip status episode',
    )
    if (!order) throw new Error('Pedido não encontrado')
    const orderItem = order.orderItems.find(
      item => item._id.toString() === orderItemId,
    )
    if (!orderItem) throw new Error('Item do pedido não encontrado')
    orderItem.status = status

    let orderStatus = order.status
    if (
      order.orderItems?.every(
        item => item.status !== 'Aguardando' && item.status !== 'Preparando',
      )
    ) {
      orderStatus = 'Pronto'
    }

    await this.repo.updateOrder({
      _id: orderId,
      orderItems: [orderItem],
      collabTip: order.collabTip,
      status: orderStatus,
    })

    await this.publisher.call({
      _id: orderId,
      status: orderStatus,
      episode: { _id: order.episode },
      who: 'prep',
    } as any)
  }

  async changeOrderItemsStatus(
    orderId: string,
    orderItemsIds: string[],
    status: string,
  ): Promise<void> {
    const order = await this.repo.getById(orderId, 'orderItems status episode')
    if (!order) throw new Error('Pedido não encontrado')

    let orderStatus = order.status

    order.orderItems?.forEach(orderItem => {
      if (orderItemsIds.includes(orderItem._id.toString())) {
        orderItem.status = status
      }
    })

    if (
      order.orderItems?.every(
        item => item.status !== 'Aguardando' && item.status !== 'Preparando',
      )
    ) {
      orderStatus = 'Pronto'
    }

    await this.repo.updateManyOrderItems({
      _id: orderId,
      orderItems: order.orderItems,
      status: orderStatus,
    })

    await this.publisher.call({
      _id: orderId,
      status: orderStatus,
      episode: { _id: order.episode },
      who: 'prep',
    } as any)
  }
}
