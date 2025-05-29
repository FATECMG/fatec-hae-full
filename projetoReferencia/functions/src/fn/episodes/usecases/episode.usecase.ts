import { inject, injectable } from 'inversify'
import { IExternal } from '../../../shared/adapters/external/interfaces.external'
import { validate } from '../../../shared/decorators/validate'
import { removeFile } from '../../../shared/firebase/storage'
import { IMenuEntity } from '../../menus/entities/menu.entity'
import { IEpisodeRepository } from '../adapters/repositories/interfaces.repository'
import {
  IDeliveryTypes,
  IEpisode,
  IPaymentTypes,
  IPodium,
  IRevenues,
  IStockView,
  ITaxAndDiscounts,
} from '../entities/interfaces'
import { Locator } from '../shared/di.enums'
import { File } from './external/interfaces'
import { IEpisodeUseCase } from './interface.usecase'
import { ValidateEpisodeUseCase } from './validations/validate.episode.usecase'
import { ValidateUpdateEpisodeLogoUseCase } from './validations/validateUpdateEpisodeLogoUseCase'
import compact from 'lodash/compact'
import BCrypt from 'bcryptjs'
import { IItemEntity } from '../../items/entities/item.entity'
import Dinero from 'dinero.js'
import { IOrdersRepository } from '../../orders/adapters/repositories/interfaces'
import {
  reducePrice,
  reduceByAnyAttribute,
  reduceDeliveryFee,
} from '../../../shared/utils/money'
import { IOrder } from '../../orders/entities/interfaces'
import flattenDeep from 'lodash/flattenDeep'
import groupBy from 'lodash/groupBy'
import uniqBy from 'lodash/uniqBy'

type FilterOrder = (order: IOrder | Record<string, any>) => boolean

function filterByStatus(statuses: string[]): FilterOrder {
  return order => statuses.includes(order.status)
}

function filterByAnyAttribute(
  attribute: string,
  values: string[],
): FilterOrder {
  return (order: Record<string, any>) => values.includes(order[attribute])
}

function filterByAnyNumberAttributeGTZero(attribute: string): FilterOrder {
  return (order: Record<string, any>) => order[attribute]
}

const paymentTypesTable: any = {
  Pix: 'pix',
  'Cartão de Crédito': 'creditCard',
  'Cartão de Débito': 'debitCard',
  Dinheiro: 'money',
  Misto: 'mixed',
}

const getPercent = (hundred: number, x: number) => (x * 100) / hundred

const buildStockItem = (item: any) => {
  const currentTotalQuantity =
    item.stock?.totalQuantity && item.stock?.totalQuantity < 0
      ? 0
      : item.stock?.totalQuantity

  const currentQuantity =
    item.stock?.quantity && item.stock?.quantity < 0 ? 0 : item.stock?.quantity

  const stockViewItem: any = {
    name: item.name,
    totalQuantity: currentTotalQuantity,
    quantity: currentQuantity,
    available: item.stock?.available,
  }

  const currentQuantityPercent = getPercent(
    item.stock?.totalQuantity && item.stock?.totalQuantity < 0
      ? 1
      : item.stock?.totalQuantity,
    item.stock?.quantity && item.stock?.quantity < 0 ? 0 : item.stock?.quantity,
  )

  stockViewItem['Estoque Definido'] = 100 - currentQuantityPercent
  stockViewItem['Estoque Atual'] = currentQuantityPercent
  stockViewItem.id = item._id.toString()
  stockViewItem.type = item.type
  stockViewItem.stockControl = item.stockControl

  return stockViewItem
}
@injectable()
export class EpisodeUseCase implements IEpisodeUseCase {
  constructor(
    @inject(Locator.EpisodeRepository)
    private episodeRepository: IEpisodeRepository,
    @inject(Locator.UploadEpisodeLogo)
    private uploadEpisodeLogo: IExternal<File, string>,
    @inject(Locator.PublishEpisodeUpdate)
    private publishEpisodeUpdate: IExternal<string, string>,
    @inject(Locator.OrderRepository)
    private orderRepo: IOrdersRepository,
  ) {}

  @validate(new ValidateEpisodeUseCase())
  async create(episode: IEpisode): Promise<IEpisode> {
    const createdEpisode = await this.episodeRepository.create(episode)
    return createdEpisode
  }

  @validate(new ValidateUpdateEpisodeLogoUseCase())
  async updateLogo(episode: IEpisode): Promise<IEpisode> {
    const { logo } = episode
    const file = {
      name: `${episode._id}-${+new Date()}`,
      content: logo,
      contentType: 'image/png',
    }

    const loadedEpisode = await this.episodeRepository.findOne(
      { _id: episode._id },
      'logo',
    )
    if (loadedEpisode.logo) {
      const parts = loadedEpisode.logo.split('/')
      const url = parts[parts.length - 1]
      await removeFile({ path: 'episodes', url })
    }
    const url = await this.uploadEpisodeLogo.call(file)

    const episodeUpdated = await this.episodeRepository.updateById(
      loadedEpisode._id,
      { logo: url },
    )

    return episodeUpdated
  }

  async getEpisodeForCollab(episode: IEpisode): Promise<IEpisode> {
    const { _id } = episode

    const loadedEpisode = await this.episodeRepository.findOne(
      { _id },
      'name printerType orderTypes paymentTypes hasCollabTip active paused enableDelivery enableGrabAndGo deliveryFees address color logo minValueOrder menus business',
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
              'name hasPhotos stock photos description type prepareTime subItems complements stockControl',
            populate: [
              {
                path: 'subItems.options.item',
                match: {
                  'stock.available': true,
                },
                select:
                  'name hasPhotos stock photos description type prepareTime subItems complements stockControl',
              },
              {
                path: 'complements.item',
                match: {
                  'stock.available': true,
                },
                select:
                  'name hasPhotos stock photos description type prepareTime subItems complements stockControl',
              },
            ],
          },
        },
        {
          path: 'business',
          select: 'cnpj contract',
          populate: {
            path: 'contract',
            select: 'features extraFeatures',
          },
        },
      ],
    )

    loadedEpisode.menus = (loadedEpisode.menus as Array<IMenuEntity>)?.map(
      m => {
        m.itemsPrice = m.itemsPrice?.map(ip => {
          if (ip.item === null) return null
          const item = ip.item as IItemEntity
          item.complements = item.complements?.filter(
            comp => (comp.item as IItemEntity)?.stock?.available,
          )
          ip.item = item
          return ip
        })
        if (m.itemsPrice && m.itemsPrice.length > 0) {
          m.itemsPrice = compact(m.itemsPrice)
          return m
        }
        return undefined
      },
    )

    loadedEpisode.menus = compact(loadedEpisode.menus)

    return loadedEpisode
  }

  async update(
    episode: IEpisode & { shouldIgnorePublish?: boolean },
  ): Promise<IEpisode> {
    const shouldPublishEpisodeUpdate = !episode.shouldIgnorePublish

    delete episode.shouldIgnorePublish
    if (episode.collaboratorsPassword) {
      const salt = BCrypt.genSaltSync(10)
      episode.collaboratorsPassword = BCrypt.hashSync(
        episode.collaboratorsPassword,
        salt,
      )
    }

    if (episode.shortLink) {
      try {
        const isAvailable = await this.isShortLinkAvailable(episode.shortLink)
        if (!isAvailable) {
          delete episode.shortLink
        }
      } catch (error) {
        console.log(error)
      }
    }

    const updatedEpisode = await this.episodeRepository.updateById(
      episode._id,
      episode,
      {
        path: 'business',
        select: 'contract',
        populate: {
          path: 'contract',
          select: 'features extraFeatures',
        },
      },
    )

    if (shouldPublishEpisodeUpdate) {
      await this.publishEpisodeUpdate.call(episode._id)
    }

    return updatedEpisode
  }

  async isShortLinkAvailable(shortLink: string): Promise<boolean> {
    try {
      await this.episodeRepository.findOne({ shortLink })
      return false
    } catch (error) {
      return true
    }
  }

  async getEpisodeByShortLink(
    shortLink: string,
    filters?: any,
  ): Promise<IEpisode> {
    try {
      const episode = await this.episodeRepository.findOne(
        { shortLink },
        filters?.projection,
      )
      return episode
    } catch (error) {
      return undefined
    }
  }

  async getRevenues(episode: IEpisode, filters?: any): Promise<IRevenues> {
    const orders = await this.orderRepo.list(
      {
        episode: episode._id,
        createdAt: {
          $gte: filters?.startDate,
          $lte: filters?.endDate,
        },
      },
      'price status',
    )

    const totalRevenuesDinero = orders?.reduce(
      reducePrice,
      Dinero({ amount: 0 }),
    )
    const total = totalRevenuesDinero.toUnit()

    const finishedOrders = orders?.filter(filterByStatus(['Finalizado']))

    const finishedDinero = finishedOrders?.reduce(
      reducePrice,
      Dinero({ amount: 0 }),
    )

    const finishedTotal = finishedDinero.toUnit()

    const pendingOrders = orders?.filter(
      filterByStatus(['Aguardando', 'Preparando', 'Transporte', 'Pronto']),
    )

    const pendingDinero = pendingOrders?.reduce(
      reducePrice,
      Dinero({ amount: 0 }),
    )

    const pendingTotal = pendingDinero.toUnit()

    const cancelledOrders = orders?.filter(filterByStatus(['Cancelado']))

    const cancelledDinero = cancelledOrders?.reduce(
      reducePrice,
      Dinero({ amount: 0 }),
    )

    const cancelledTotal = cancelledDinero.toUnit()

    const avgTicketDinero = totalRevenuesDinero.divide(orders?.length || 1)

    const avgTicketTotal = avgTicketDinero.toUnit()

    return {
      total,
      totalCount: orders?.length,
      finishedTotal,
      finishedCount: finishedOrders?.length,
      pendingTotal,
      pendingCount: pendingOrders?.length,
      cancelledTotal,
      cancelledCount: cancelledOrders?.length,
      avgTicketTotal,
    }
  }

  async getDeliveryTypes(
    episode: IEpisode,
    filters?: any,
  ): Promise<IDeliveryTypes> {
    const orders = await this.orderRepo.list(
      {
        episode: episode._id,
        createdAt: {
          $gte: filters?.startDate,
          $lte: filters?.endDate,
        },
      },
      'price deliveryType',
    )

    const delivery = orders?.filter(
      filterByAnyAttribute('deliveryType', ['Delivery']),
    )

    const deliveryDinero = delivery?.reduce(reducePrice, Dinero({ amount: 0 }))

    const deliveryTotal = deliveryDinero.toUnit()

    const local = orders?.filter(
      filterByAnyAttribute('deliveryType', ['Consumo Local']),
    )

    const localDinero = local?.reduce(reducePrice, Dinero({ amount: 0 }))

    const localTotal = localDinero.toUnit()

    const retirada = orders?.filter(
      filterByAnyAttribute('deliveryType', ['Retirada']),
    )

    const retiradaDinero = retirada?.reduce(reducePrice, Dinero({ amount: 0 }))

    const retiradaTotal = retiradaDinero.toUnit()

    return {
      deliveryCount: delivery?.length,
      deliveryTotal,
      localCount: local?.length,
      localTotal,
      takeawayCount: retirada?.length,
      takeawayTotal: retiradaTotal,
    }
  }

  async getPaymentTypes(
    episode: IEpisode,
    filters?: any,
  ): Promise<IPaymentTypes> {
    const orders = await this.orderRepo.list(
      {
        episode: episode._id,
        createdAt: {
          $gte: filters?.startDate,
          $lte: filters?.endDate,
        },
      },
      'price paymentType paymentSplit',
    )

    // optimized way to group by paymentType
    const ordersData = orders?.reduce((acc, order) => {
      const paymentTypeKey = paymentTypesTable[order.paymentType]
      if (paymentTypeKey !== 'mixed') {
        acc[`${paymentTypeKey}Total`] =
          (acc[`${paymentTypeKey}Total`] || 0) + order.price
        acc[`${paymentTypeKey}Count`] = (acc[`${paymentTypeKey}Count`] || 0) + 1
      } else {
        order.paymentSplit?.reduce((iacc, ps) => {
          const splitPaymentTypeKey = paymentTypesTable[ps.type]
          acc[`${splitPaymentTypeKey}Total`] =
            (acc[`${splitPaymentTypeKey}Total`] || 0) + ps.value
          acc[`${splitPaymentTypeKey}Count`] =
            (acc[`${splitPaymentTypeKey}Count`] || 0) + 1
          return iacc
        }, acc)
      }
      return acc
    }, {} as any)

    console.log(ordersData)

    ordersData.count = orders?.length

    return ordersData
  }

  async getTaxAndDiscounts(
    episode: IEpisode,
    filters?: any,
  ): Promise<ITaxAndDiscounts> {
    const orders = await this.orderRepo.list(
      {
        episode: episode._id,
        createdAt: {
          $gte: filters?.startDate,
          $lte: filters?.endDate,
        },
      },
      'price discount collabTip deliveryType deliveryFee',
    )
    const deliveryOrders = orders?.filter(
      filterByAnyAttribute('deliveryType', ['Delivery']),
    )

    const deliveryTaxDinero = deliveryOrders?.reduce(
      reduceDeliveryFee,
      Dinero({ amount: 0 }),
    )

    const deliveryTaxTotal = deliveryTaxDinero.toUnit()

    const collabTipOrders = orders?.filter(
      filterByAnyNumberAttributeGTZero('collabTip'),
    )

    const collabTipDinero = collabTipOrders?.reduce(
      reduceByAnyAttribute('collabTip'),
      Dinero({ amount: 0 }),
    )

    const serviceTaxTotal = collabTipDinero.toUnit()

    const discountOrders = orders?.filter(
      filterByAnyNumberAttributeGTZero('discount'),
    )

    const discountDinero = discountOrders?.reduce(
      reduceByAnyAttribute('discount'),
      Dinero({ amount: 0 }),
    )

    const discountTotal = discountDinero.toUnit()

    const total = discountTotal + serviceTaxTotal + deliveryTaxTotal

    return {
      deliveryTaxTotal,
      serviceTaxTotal,
      discountTotal,
      total,
    }
  }

  async getPodium(episode: IEpisode, filters?: any): Promise<IPodium> {
    const orders = await this.orderRepo.list(
      {
        episode: episode._id,
        createdAt: {
          $gte: filters?.startDate,
          $lte: filters?.endDate,
        },
      },
      'orderItems',
    )

    const items = Object.entries(
      groupBy(
        flattenDeep(
          orders.map(order => {
            return order.orderItems.map(orderItem => {
              const array = []
              array.push(orderItem)
              if (orderItem.options.length > 0) {
                array.push(...orderItem.options)
              }
              return array
            })
          }),
        ).filter((item: any) => !item.isNotPodiumCalc),
        ({ name }) => name,
      ),
    ).map((o: any[]) => {
      const [name, value] = o
      const [first] = value
      const total = value.reduce(reducePrice, Dinero({ amount: 0 })).toUnit()

      const item: any = {
        name,
        total,
        count: value.length,
        details: [],
      }

      if (first.label === 'Composto') {
        item.details = Object.entries(
          groupBy(
            value.map((order: any) => {
              return {
                ...order,
                name: order.name
                  .concat(', ')
                  .concat(
                    order.options?.map((opt: any) => opt.name).join(', '),
                  ),
              }
            }),
            ({ name }) => name,
          ),
        ).map((o: any[]) => {
          const [name, value] = o
          const total = value
            .reduce(reducePrice, Dinero({ amount: 0 }))
            .toUnit()

          return {
            name,
            total,
            count: value.length,
          }
        })

        item.details = item.details.sort((a: any, b: any) => {
          return b.count - a.count
        })
      }
      return item
    })

    items.sort((a, b) => {
      return b.count - a.count
    })

    return {
      items,
    }
  }

  async getStockView(episode: IEpisode, filters?: any): Promise<IStockView> {
    const loadedEpisode = await this.episodeRepository.findOne(
      { _id: episode._id, ...filters },
      'menus',
      {
        path: 'menus',
        populate: {
          path: 'itemsPrice.item',
          select: 'name stockControl stock subItems type complements',
          populate: [
            {
              path: 'subItems.options.item',
              select: 'name stockControl stock type',
            },
            {
              path: 'complements.item',
              select: 'name stockControl stock type',
            },
          ],
        },
      },
    )

    const items = uniqBy(
      flattenDeep(
        loadedEpisode.menus?.map((menu: any) => {
          return menu.itemsPrice.map(({ item }: any) => {
            const stockViewItem = buildStockItem(item)
            const optionsStockViewItems = item.subItems.map((subItem: any) => {
              return subItem.options
                ?.filter((option: any) => {
                  return (
                    option.item?.type !== 'Característico' &&
                    option.item?.stockControl !== 'uncontrolled'
                  )
                })
                ?.map((option: any) => {
                  return buildStockItem(option.item)
                })
            })

            const complementsStockViewItems = item.complements
              ?.filter((complement: any) => {
                return (
                  complement.item?.type !== 'Característico' &&
                  complement.item?.stockControl !== 'uncontrolled'
                )
              })
              .map((complement: any) => {
                return buildStockItem(complement.item)
              })

            return [
              stockViewItem,
              optionsStockViewItems,
              complementsStockViewItems,
            ]
          })
        }),
      ),
      'id',
    ).filter((item: any) => {
      return (
        item?.type !== 'Característico' && item?.stockControl !== 'uncontrolled'
      )
    })

    return {
      chart: items,
    }
  }

  async getMenus(episode: IEpisode, filters?: any): Promise<any[]> {
    const loadedEpisode = await this.episodeRepository.findOne(
      { _id: episode._id, ...filters },
      'menus',
      {
        path: 'menus',
        select: 'name itemsPrice',
        populate: {
          path: 'itemsPrice',
          select: 'item',
          populate: {
            path: 'item',
            select: 'stock photos name complements subItems type stockControl',
            populate: [
              {
                path: 'subItems.options.item',
                select: 'name photos stock type stockControl',
              },
              {
                path: 'complements.item',
                select: 'name photos stock type stockControl',
              },
            ],
          },
        },
      },
    )

    return loadedEpisode.menus
  }

  async getForPrep(episode: IEpisode, filters?: any): Promise<any> {
    return await this.episodeRepository.findOne(
      episode,
      'logo color name business address',
      { path: 'business', select: 'cpf cpnj' },
    )
  }
}
