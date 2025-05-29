import 'reflect-metadata'
import axios, { AxiosResponse } from 'axios'
import { mocked } from 'ts-jest/utils'
import { ComposeAddressByPlaceIdExternal } from '../composeAddressByPlaceId.external'

jest.mock('axios')
const mockedAxios = mocked(axios, true)
describe('composeAddressByPlaceId external', () => {
  const composeAddressByPlaceId = new ComposeAddressByPlaceIdExternal()
  it('should return an composed address', async () => {
    mockedAxios.mockResolvedValueOnce({
      data: { street: 'R. Macatuba' },
    } as AxiosResponse)
    const address = await composeAddressByPlaceId.call('dsa')
    expect(address.street).toBe('R. Macatuba')
  })
  it('should return error because something is down', async () => {
    mockedAxios.mockRejectedValueOnce({
      response: { data: { error: 'error' } },
    })
    expect(composeAddressByPlaceId.call('place')).rejects.toThrow(
      'Problema no serviço de composição de endereço.',
    )
  })
})
