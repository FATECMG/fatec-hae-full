import 'reflect-metadata'
import { GetMissingDocuments } from '../getMissingDocuments.extermal'
import { mocked } from 'ts-jest/utils'
import axios, { AxiosResponse } from 'axios'

jest.mock('axios')
const mockedAxios = mocked(axios, true)

describe('getMissingDocuments function', () => {
  const getMissingDocuments = new GetMissingDocuments()
  it('should return missing documents for a resourceToken', async () => {
    mockedAxios.mockResolvedValue({
      data: {
        _embedded: {
          documents: [
            { id: '1', approvalStatus: 'approved' },
            { id: '2', approvalStatus: 'approved' },
            { id: '3', approvalStatus: 'waiting' },
          ],
        },
      },
    } as AxiosResponse)

    const missing = await getMissingDocuments.call({
      resourceToken: 'someresourcetoken',
      authToken: 'someauthtoken',
    })

    expect(missing).toBeDefined()
  })
})
