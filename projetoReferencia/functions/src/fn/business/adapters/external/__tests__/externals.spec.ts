import 'reflect-metadata'
import { ListBankExternal } from '../list.bank.external'
import axios, { AxiosResponse } from 'axios'
import { mocked } from 'ts-jest/utils'
jest.mock('axios')
const mockedAxios = mocked(axios, true)
describe('list bank', () => {
  mockedAxios
    .mockRejectedValueOnce({
      response: { data: { message: 'juno is down' } },
    })
    .mockResolvedValueOnce({
      data: { _embedded: { banks: [{ name: 'BB', number: '001' }] } },
    } as AxiosResponse)
  const listBankExternal = new ListBankExternal()
  it('should not get banks because third party is down', async () => {
    await expect(listBankExternal.call('someauth')).rejects.toThrow(
      'Conexão com API de bancos perdida.',
    )
  })
  it('should get banks from thrid party', async () => {
    const banks = await listBankExternal.call('someauth')
    expect(banks).toHaveLength(1)
    const [bank] = banks
    expect(bank.name).toBe('BB')
  })
})
