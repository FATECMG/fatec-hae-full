import 'reflect-metadata'

import { ViaCepToAddressMapper } from '@functions/address/adapter/mapper/ViaCepToAddressMapper'

describe('ViaCepToAddressMapper', () => {
  let systemUnderTest: ViaCepToAddressMapper

  beforeAll(() => {
    systemUnderTest = new ViaCepToAddressMapper()
  })

  it('should map correctly', async () => {
    const result = await systemUnderTest.execute({
      cep: 'any_cep',
      logradouro: 'any_street',
      complemento: 'any_complement',
      bairro: 'any_district',
      localidade: 'any_city',
      uf: 'any_state',
      igbe: 'any_igbe',
      gia: 'any_gia',
      ddd: 'any_ddd',
      siafi: 'any_siafi'
    })

    expect(result).toEqual({
      street: 'any_street',
      complement: 'any_complement',
      district: 'any_district',
      city: 'any_city',
      state: 'any_state'
    })
  })
})
