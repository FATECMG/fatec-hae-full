import 'reflect-metadata'

import { GeneratePostURL } from '@functions/utils/s3urls/usecases/GeneratePostUrl'
import { type GeneratePreSignedURLInterface } from '@common/s3url/GeneratePreSignedURL.interface'
import { GeneratePreSignedUrlError } from '@common/error/GeneratePreSignedUrlError'
import { type PostURLRequest } from '@functions/utils/s3urls/entities/GeneratePostUrl'

import { type MockProxy, mock } from 'jest-mock-extended'

describe.only('GeneratePostUrl UseCase', () => {
  let systemUnderTest: GeneratePostURL
  let s3ServiceMock: MockProxy<GeneratePreSignedURLInterface>
  let postURLRequest: PostURLRequest
  let data: any

  beforeAll(() => {
    postURLRequest = {
      resourceId: 'any_report_id',
      resourceType: 'any_type',
      quantity: 1
    }

    data = {
      url: 'any_url'
    }

    s3ServiceMock = mock()
    s3ServiceMock.getPreSignedPostURLs.mockResolvedValue('any_url')

    systemUnderTest = new GeneratePostURL(s3ServiceMock)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should returns an array of strings when quantity is more than 1', async () => {
    const result = await systemUnderTest.execute({ quantity: 2, resourceType: 'reports', resourceId: 'any_report_id' })

    expect(result).toEqual([data, data])
  })

  it('should throws if S3GeneratePreSignedPostURL throws GeneratePreSignedUrlError', async () => {
    s3ServiceMock.getPreSignedPostURLs.mockRejectedValueOnce(new GeneratePreSignedUrlError())

    const promise = systemUnderTest.execute(postURLRequest)

    await expect(promise).rejects.toThrow(new GeneratePreSignedUrlError())
  })

  it('should throws if S3GeneratePreAssignedPostURL throws GeneratePreAssignedUrlError', async () => {
    s3ServiceMock.getPreSignedPostURLs.mockRejectedValueOnce(new GeneratePreSignedUrlError())

    const promise = systemUnderTest.execute(postURLRequest)

    await expect(promise).rejects.toThrow(new GeneratePreSignedUrlError())
  })
})
