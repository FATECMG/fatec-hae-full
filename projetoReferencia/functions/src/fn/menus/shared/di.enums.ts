const Locator = {
  MenuRepository: Symbol.for('MenuRepository'),
  CreateMenuUseCase: Symbol.for('CreateMenuUseCase'),
  CreateMenuController: Symbol.for('CreateMenuController'),
  CreateManyItemsRequest: Symbol.for('CreateManyItemsRequest'),
  ListMenuUseCase: Symbol.for('ListMenuUseCase'),
  ListMenusController: Symbol.for('ListMenusController'),
  DetailsMenuUseCase: Symbol.for('DetailsMenuUseCase'),
  DetailsMenuController: Symbol.for('DetailsMenuController'),
  EpisodeRepository: Symbol.for('EpisodeRepository'),
  ToggleMenuInStoreUseCase: Symbol.for('ToggleMenuInStoreUseCase'),
  ToggleMenuInStoreController: Symbol.for('ToggleMenuInStoreController'),
  UpdateMenuUseCase: Symbol.for('UpdateMenuUseCase'),
  UpdateMenuController: Symbol.for('UpdateMenuController'),
  PublishEpisodeUpdate: Symbol.for('PublishEpisodeUpdate'),
  GetItemPriceUseCase: Symbol.for('GetItemPriceUseCase'),
  GetItemPriceHttp: Symbol.for('GetItemPriceHttp'),
  UpdateItemPriceUseCase: Symbol.for('UpdateItemPriceUseCase'),
  UpdateItemPriceHttp: Symbol.for('UpdateItemPriceHttp'),
  RemoveMenuUseCase: Symbol.for('RemoveMenuUseCase'),
  RemoveMenuHttp: Symbol.for('RemoveMenuHttp'),
}

export { Locator }
