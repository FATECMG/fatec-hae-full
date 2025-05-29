import { type Mapper } from '@common/mapper/BaseMapper'

import { type Address } from '@functions/address/entities/Address'
import { type ViaCepAddress } from '@functions/address/entities/dto/ViaCepAddress'

import { injectable } from 'inversify'

/**
 * Implementation of the Mapper interface that maps a ViaCepAddress object to an Address object.
 */
@injectable()
export class ViaCepToAddressMapper implements Mapper<ViaCepAddress, Address> {
  /**
   * Maps a ViaCepAddress object to an Address object.
   * @param entity - A ViaCepAddress object to be mapped.
   * @returns A Promise that resolves to an Address object with the mapped properties.
   */
  async execute (entity: ViaCepAddress): Promise<Address> {
    return {
      street: entity.logradouro,
      complement: entity.complemento,
      district: entity.bairro,
      city: entity.localidade,
      state: entity.uf
    }
  }
}
