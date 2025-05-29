import {
  format,
  isWithinInterval,
  setHours,
  setMinutes,
  getHours,
  getMinutes,
} from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import { inject, injectable } from 'inversify'
import { DomainError } from '../../../shared/errors/domain.error'
import { IContractRepository } from '../../contracts/adapters/repositories/interfaces'
import {
  IMenuEntity,
  TypesOfConsumption,
} from '../../menus/entities/menu.entity'
import { IEpisodeRepository } from '../adapters/repositories/interfaces.repository'
import { IEpisode, IStockControlMode } from '../entities/interfaces'
import { Locator } from '../shared/di.enums'
import * as functions from 'firebase-functions'
import { IFeatures } from '../../contracts/entities/interfaces'
import { ptBR } from 'date-fns/locale'
import intersection from 'lodash/intersection'
import compact from 'lodash/compact'
import { IItemEntity } from '../../items/entities/item.entity'

type EpisodeStoreBody = {
  episode: string
  typesOfConsumption: TypesOfConsumption[]
}

type GetHasStockControllerBody = {
  features: IFeatures
  stockControlMode: IStockControlMode
}

type GetMenusAvailablesToStoreBody = {
  menus: Array<IMenuEntity>
  typesOfConsumption: TypesOfConsumption[]
}

export interface IEpisodeStoreUseCase {
  getEpisodeForStore(body: EpisodeStoreBody): Promise<IEpisode>
}

@injectable()
export class EpisodeStoreUsecase implements IEpisodeStoreUseCase {
  constructor(
    @inject(Locator.EpisodeRepository)
    private episodeRepository: IEpisodeRepository,
    @inject(Locator.ContractRepository)
    private contractRepository: IContractRepository,
  ) {}

  async getEpisodeForStore({
    episode: episodeId,
    typesOfConsumption = ['Consumo Local', 'Delivery', 'Retirada'],
  }: EpisodeStoreBody): Promise<IEpisode> {
    const episode = await this.episodeRepository.findOne(
      { _id: episodeId },
      'name active menus paused stockControlMode active hasCollabTip orderTypes paymentTypes business deliveryFees enableDelivery daysOfWork logo color minValueOrder address orderIdleTime pixKey hasNotMap neighborhoodFees initialListMode',
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
              'name hasPhotos stock photos description type prepareTime subItems complements typesOfConsumption stockControl',
            populate: [
              {
                path: 'subItems.options.item',
                match: {
                  'stock.available': true,
                },
                select:
                  'name hasPhotos stock photos description type typesOfConsumption stockControl',
              },
              {
                path: 'complements.item',
                match: {
                  'stock.available': true,
                },
                select:
                  'name hasPhotos stock photos description type typesOfConsumption stockControl',
              },
            ],
          },
        },
        { path: 'business', select: 'contract phone' },
      ],
    )
    if (!episode)
      throw new DomainError({
        errorCode: 'episode-002',
        message: 'Evento não encontrado',
      })

    const { features, extraFeatures } = await this.contractRepository.findOne(
      { _id: episode.business.contract },
      'features extraFeatures',
    )

    const allFeatures = [...features, ...extraFeatures]

    const [
      menus,
      isItWorkingNow,
      hasStockController,
      publicKey,
    ] = await Promise.all([
      this.getMenusAvailablesToStore({
        menus: episode.menus as any,
        typesOfConsumption,
      }),
      this.getEpisodeIsItWorking(episode),
      this.getHasStockController({
        features: allFeatures,
        stockControlMode: episode.stockControlMode,
      }),
      this.getZelpayPublicKey(),
    ])

    episode.menus = menus

    return {
      _id: episode._id,
      name: episode.name,
      menus: episode.menus,
      active: episode.active,
      paused: episode.paused,
      publicKey: publicKey,
      orderTypes: episode.orderTypes,
      paymentTypes: episode.paymentTypes,
      deliveryFees: episode.deliveryFees,
      enableDelivery: episode.enableDelivery,
      address: episode.address,
      hasCollabTip: episode.hasCollabTip,
      isItWorkingNow,
      hasStockController,
      logo: episode.logo,
      color: episode.color,
      minValueOrder: episode.minValueOrder,
      orderIdleTime: episode.orderIdleTime,
      pixKey: episode.pixKey,
      phone: episode.business.phone,
      hasNotMap: episode.hasNotMap,
      neighborhoodFees: episode.neighborhoodFees,
      initialListMode: episode.initialListMode,
    } as any
  }

  async getMenusAvailablesToStore({
    menus,
    typesOfConsumption,
  }: GetMenusAvailablesToStoreBody): Promise<IMenuEntity[]> {
    let newMenus: IMenuEntity[] = []

    newMenus = menus.map(menu => {
      if (!menu.itemsPrice || menu.itemsPrice.length === 0) return null
      menu.itemsPrice = menu.itemsPrice.map(ip => {
        if (!ip.item) return null
        const hasIntersection = intersection(
          typesOfConsumption,
          (ip.item as any).typesOfConsumption,
        ).length
        if (hasIntersection) {
          const item: IItemEntity = ip.item as IItemEntity
          item.complements = item.complements?.filter(complement =>
            Boolean(
              (complement.item as IItemEntity)?.stock?.available &&
                intersection(
                  typesOfConsumption,
                  (complement.item as IItemEntity).typesOfConsumption,
                ).length,
            ),
          )
          item.subItems = item.subItems?.map(sub => {
            sub.options = sub.options?.filter(
              option =>
                !!option.item &&
                Boolean(
                  intersection(
                    typesOfConsumption,
                    (option.item as IItemEntity).typesOfConsumption,
                  ).length,
                ),
            )
            return sub
          })

          ip.item = item
          return ip
        }
        return null
      })
      menu.itemsPrice = compact(menu.itemsPrice)
      if (menu.itemsPrice.length === 0) return null
      return menu
    })

    newMenus = compact(newMenus)

    return newMenus
  }

  private async getEpisodeIsItWorking(episode: IEpisode): Promise<boolean> {
    const { daysOfWork } = episode
    const now = utcToZonedTime(new Date(), 'America/Sao_Paulo')
    const dayName = format(now, 'E', { locale: ptBR })
    const dayOfWork = daysOfWork
      ? daysOfWork.find(day =>
          Boolean(dayName.match(new RegExp(day.dayName, 'gi'))),
        )
      : undefined

    if (!dayOfWork) return false

    const initial = utcToZonedTime(dayOfWork.initialTime, 'America/Sao_Paulo')
    const final = utcToZonedTime(dayOfWork.finalTime, 'America/Sao_Paulo')

    let initialToday = utcToZonedTime(new Date(), 'America/Sao_Paulo')
    let finalToday = utcToZonedTime(new Date(), 'America/Sao_Paulo')

    initialToday = setHours(initialToday, getHours(initial))
    initialToday = setMinutes(initialToday, getMinutes(initial))
    finalToday = setHours(finalToday, getHours(final))
    finalToday = setMinutes(finalToday, getMinutes(final))

    return isWithinInterval(now, {
      start: initialToday,
      end: finalToday,
    })
  }

  private async getHasStockController({
    features,
    stockControlMode,
  }: GetHasStockControllerBody): Promise<boolean> {
    const hasStockFeature = features.includes('stock')
    const hasStockControll = stockControlMode.type === 'Controle Total'
    return Boolean(hasStockFeature && hasStockControll)
  }

  private async getZelpayPublicKey(): Promise<string> {
    return functions.config().payment.public.toString()
  }
}
