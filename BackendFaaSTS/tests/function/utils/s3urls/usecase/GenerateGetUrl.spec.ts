import 'reflect-metadata'

import { type GeneratePreSignedURLInterface } from '@common/s3url/GeneratePreSignedURL.interface'
import { type GenerateUrlRequest } from '@functions/utils/s3urls/entities/GeneratePostUrl'
import { GenerateGetURL } from '@functions/utils/s3urls/usecases/GenerateGetUrl'
import { type MockProxy, mock } from 'jest-mock-extended'
import { GeneratePreSignedUrlError } from '@common/error/GeneratePreSignedUrlError'

describe.only('GenerateGetUrl UseCase', () => {
  let systemUnderTest: GenerateGetURL
  let s3ServiceMock: MockProxy<GeneratePreSignedURLInterface>
  let getURLRequest: GenerateUrlRequest

  beforeAll(() => {
    getURLRequest = {
      resourceId: 'any_report_id',
      resourceType: 'any_type'
    }

    s3ServiceMock = mock()
    s3ServiceMock.getPreSignedGetURLs.mockResolvedValue(['any_url'])

    systemUnderTest = new GenerateGetURL(s3ServiceMock)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should returns an array of strings', async () => {
    const result = await systemUnderTest.execute(getURLRequest)

    expect(result).toEqual([{ url: 'any_url' }])
  })

  it('should throws if S3GeneratePreAssignedPostURL throws GeneratePreAssignedUrlError', async () => {
    s3ServiceMock.getPreSignedGetURLs.mockRejectedValueOnce(new GeneratePreSignedUrlError())

    const promise = systemUnderTest.execute(getURLRequest)

    await expect(promise).rejects.toThrow(new GeneratePreSignedUrlError())
  })
})
