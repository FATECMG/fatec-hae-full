import 'reflect-metadata'
import { IExternal } from '../../../../../shared/adapters/external/interfaces.external'
import { IAddress } from '../../../entities/interfaces.entity'
import { container } from '../../../shared/di.container'
import { Locator } from '../../../shared/di.enums'

describe('getaddressbyplaceid.external', () => {
  const getAddressExternal = container.get<IExternal<string, IAddress>>(
    Locator.GetAddressByPlaceIdExternal,
  )
  it('should getaddress given a correct placeid', async () => {
    const address = await getAddressExternal.call('ChIJxfGTSPd7zpQRiBrHt8DtKhI')
    expect(address).toBeDefined()
    expect(address.city).toBe('Itaquaquecetuba')
    expect(address.neighborhood).toBe('Estância Paraíso')
    expect(address.street).toBe('R. Macatuba')
  })
})
