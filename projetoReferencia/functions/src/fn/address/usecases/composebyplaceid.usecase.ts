import { inject, injectable } from 'inversify'
import { IExternal } from '../../../shared/adapters/external/interfaces.external'
import { IAddress } from '../entities/interfaces.entity'
import { Locator } from '../shared/di.enums'
import { IComposeByPlaceIdUseCase } from './interfaces.usecases'

@injectable()
export class ComposeByPlaceIdUseCase implements IComposeByPlaceIdUseCase {
  constructor(
    @inject(Locator.GetAddressByPlaceIdExternal)
    private getAddress: IExternal<string, IAddress>,
  ) {}
  async compose(placeId: string): Promise<IAddress> {
    const address = await this.getAddress.call(placeId)
    return address
  }
}
