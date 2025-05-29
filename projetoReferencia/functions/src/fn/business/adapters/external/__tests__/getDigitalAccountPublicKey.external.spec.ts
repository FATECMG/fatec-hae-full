import 'reflect-metadata'
import axios, { AxiosResponse } from 'axios'
import { mocked } from 'ts-jest/utils'
import { GetDigitalAccountPublicKey } from '../getDigitalAccountPublicKey.external'

jest.mock('axios')
const mockedAxios = mocked(axios, true)

describe('getDigitalAccountPublicKey function', () => {
  const getDigitalAccountPublicKey = new GetDigitalAccountPublicKey()
  it('should get a valid digital account public key', async () => {
    mockedAxios.mockResolvedValue({ data: 'agiantpublickey' } as AxiosResponse)
    const pk = await getDigitalAccountPublicKey.call({
      authToken: 'sometoken',
      resourceToken: 'someresource',
    })
    expect(pk).toBe('agiantpublickey')
  })
})
