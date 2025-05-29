import { IAddress } from '../entities/interfaces.entity'

export interface IComposeByPlaceIdUseCase {
  compose(placeId: string): Promise<IAddress>
}
