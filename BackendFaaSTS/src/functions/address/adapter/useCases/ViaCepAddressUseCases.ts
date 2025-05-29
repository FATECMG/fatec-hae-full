import { type IHttpClient } from '@common/http/Client'
import { type Mapper } from '@common/mapper/BaseMapper'
import { InfraError } from '@common/error/InfraError'

import { type ViaCepAddress } from '@functions/address/entities/dto/ViaCepAddress'
import { type Address } from '@functions/address/entities/Address'
import { AddressLocator } from '@functions/address/shared/Di.enums'
import { type AddressUseCases } from '@functions/address/useCases/AddressUseCases.interface'

import { inject, injectable } from 'inversify'

/**
 * Implementation of the AddressUseCases interface that retrieves address information from the ViaCep API.
 */
@injectable()
export class ViaCepAddressUseCases implements AddressUseCases {
  /**
   * Creates a new instance of the ViaCepAddressUseCases class.
   * @param httpClient - An instance of the IHttpClient interface used to make HTTP requests to the ViaCep API.
   * @param mapper - An instance of the Mapper class used to map the response from the API to an Address object.
   */
  constructor (
    @inject(AddressLocator.HttpClient) private readonly httpClient: IHttpClient,
    @inject(AddressLocator.AddressMapper) private readonly mapper: Mapper<ViaCepAddress, Address>
  ) {}

  /**
   * Retrieves address information for a given Brazilian postal code from the ViaCep API.
   * @param cep - A string representing a Brazilian postal code.
   * @returns A Promise that resolves to an Address object if the request is successful, or an Error object if the postal code is not found.
   * @throws An InfraError if an unexpected error occurs.
   */
  async getAddress (cep: string): Promise<Address | Error> {
    try {
      const result = await this.httpClient.request({ url: `https://viacep.com.br/ws/${cep}/json/`, method: 'get' })
      return result.data?.erro !== undefined ? new Error(`Não foi possível encontrar um CEP: ${cep}`) : await this.mapper.execute(result.data)
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message)
      throw new InfraError('Erro inesperado')
    }
  }
}
