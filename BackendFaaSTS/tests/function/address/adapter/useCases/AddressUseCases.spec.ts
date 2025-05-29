import 'reflect-metadata'

import { type IHttpClient } from '@common/http/Client'
import { type Mapper } from '@common/mapper/BaseMapper'

import { type ViaCepAddress } from '@functions/address/entities/dto/ViaCepAddress'
import { type Address } from '@functions/address/entities/Address'
import { ViaCepAddressUseCases } from '@functions/address/adapter/useCases/ViaCepAddressUseCases'

import { type MockProxy, mock } from 'jest-mock-extended'

describe('AddressUseCases', () => {
  let systemUnderTest: ViaCepAddressUseCases
  let httpClient: MockProxy<IHttpClient>
  let mapper: MockProxy<Mapper<ViaCepAddress, Address>>

  beforeAll(() => {
    httpClient = mock()
    httpClient.request.mockResolvedValue({
      statusCode: 200,
      data: { any: 'any' }
    })
    mapper = mock()
    mapper.execute.mockImplementation(jest.fn().mockResolvedValue({ any: 'any' }))
    systemUnderTest = new ViaCepAddressUseCases(httpClient, mapper)
  })

  it('should calls httpClient and mapper with correct parameters', async () => {
    await systemUnderTest.getAddress('any_cep')

    expect(httpClient.request).toHaveBeenCalledWith({ url: 'https://viacep.com.br/ws/any_cep/json/', method: 'get' })
    expect(httpClient.request).toHaveBeenCalledTimes(1)
    expect(mapper.execute).toHaveBeenCalledWith({ any: 'any' })
    expect(mapper.execute).toHaveBeenCalledTimes(1)
  })

  it('should return an Error if invalid cep is provided', async () => {
    httpClient.request.mockResolvedValueOnce({ statusCode: 200, data: { erro: true } })

    const result = await systemUnderTest.getAddress('invalid_cep')

    expect(result).toEqual(new Error('Não foi possível encontrar um CEP: invalid_cep'))
  })

  it('should return a valid addres if valid cep is provided', async () => {
    httpClient.request.mockResolvedValueOnce({ statusCode: 200, data: { } })

    const result = await systemUnderTest.getAddress('valid_cep')

    expect(result).toEqual({ any: 'any' })
  })

  it('should throw if httpClient throws', async () => {
    httpClient.request.mockRejectedValueOnce(new Error('http_error'))

    const promise = systemUnderTest.getAddress('any_cep')

    await expect(promise).rejects.toThrow(new Error('http_error'))
  })
})
