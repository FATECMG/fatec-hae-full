import { ISuperBusiness } from '../entities/interfaces.entities'

export interface ISuperBusinessUseCase {
  login?(
    superBusiness: ISuperBusiness,
  ): Promise<{ superb: ISuperBusiness; jwt: string }>
}
