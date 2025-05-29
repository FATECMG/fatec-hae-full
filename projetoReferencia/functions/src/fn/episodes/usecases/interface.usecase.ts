import {
  IDeliveryTypes,
  IEpisode,
  IPaymentTypes,
  IPodium,
  IRevenues,
  ITaxAndDiscounts,
  IStockView,
} from '../../episodes/entities/interfaces'

export interface IEpisodeUseCase {
  create?(episode: IEpisode): Promise<IEpisode>
  updateLogo?(episode: IEpisode): Promise<IEpisode>
  getEpisodeForCollab?(episode: IEpisode): Promise<IEpisode>
  isShortLinkAvailable?(shortLink: string): Promise<boolean>
  getEpisodeByShortLink?(shortLink: string, filters?: any): Promise<IEpisode>
  update?(
    episode: IEpisode & { shouldIgnorePublish?: boolean },
  ): Promise<IEpisode>
  getRevenues?(episode: IEpisode, filters?: any): Promise<IRevenues>
  getDeliveryTypes?(episode: IEpisode, filters?: any): Promise<IDeliveryTypes>
  getPaymentTypes?(episode: IEpisode, filters?: any): Promise<IPaymentTypes>
  getTaxAndDiscounts?(
    episode: IEpisode,
    filters?: any,
  ): Promise<ITaxAndDiscounts>
  getPodium?(episode: IEpisode, filters?: any): Promise<IPodium>
  getStockView?(episode: IEpisode, filters?: any): Promise<IStockView>
  getMenus?(episode: IEpisode, filters?: any): Promise<any[]>
  getForPrep?(episode: IEpisode, filters?: any): Promise<any>
}
