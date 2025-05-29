import { ISuperBusiness } from '../../entities/interfaces.entities'

export interface ISuperBusinessRepository {
  login?(superBusiness: ISuperBusiness): Promise<ISuperBusiness>
}
