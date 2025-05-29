import 'reflect-metadata'

import { AxiosHttpClient } from '@common/external/http/AxiosHttpClient'
import { axiosInstance } from '@common/external/http/AxiosInstance'

jest.mock('@common/external/http/AxiosInstance', () => ({
  axiosInstance: {
    request: jest.fn().mockResolvedValue({
      status: 200,
      data: {
        any: 'any_data'
      }
    })
  }
}))

describe('AxiosHttpClient', () => {
  let systemUnderTest: AxiosHttpClient

  beforeAll(() => {
    systemUnderTest = new AxiosHttpClient()
  })

  it('should return data when axios complete request', async () => {
    const result = await systemUnderTest.request({
      method: 'post',
      url: 'any_url',
      body: {
        any: 'any_data'
      }
    })

    expect(result).toEqual({ statusCode: 200, data: { any: 'any_data' } })
  })

  it('should rethrow when axios throws', async () => {
    (axiosInstance.request as jest.Mock).mockRejectedValueOnce(new Error('any_data'))

    const promise = systemUnderTest.request({
      method: 'post',
      url: 'any_url',
      body: {
        any: 'any_data'
      }
    })

    await expect(promise).rejects.toThrow(new Error('any_data'))
  })
})
