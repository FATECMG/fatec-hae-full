import 'reflect-metadata'

import { GenerateGetURLController } from '@functions/utils/s3urls/controller/GenerateGetUrlController'
import { type GeneratePreSignedUrlGetUseCase } from '@functions/utils/s3urls/usecases/GenerateGetUrl'
import { type MockProxy, mock } from 'jest-mock-extended'
import { GeneratePreSignedUrlError } from '@common/error/GeneratePreSignedUrlError'

describe.only('GenerateGetUrl Controller', () => {
  let systemUnderTest: GenerateGetURLController
  let useCase: MockProxy<GeneratePreSignedUrlGetUseCase>

  beforeAll(() => {
    useCase = mock()
    useCase.execute.mockResolvedValue([{ url: 'any_url' }])

    systemUnderTest = new GenerateGetURLController(useCase)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should returns an array string', async () => {
    const result = await systemUnderTest.handle({ resourceId: 'any_report_id', resourceType: 'any_purpose' })

    expect(result).toEqual({ statusCode: 200, data: [{ url: 'any_url' }] })
  })

  it('should throws if GenerateGetURLUseCase throws', async () => {
    useCase.execute.mockRejectedValueOnce(new Error())

    const result = await systemUnderTest.handle({ resourceId: 'any_report_id', resourceType: 'any_purpose' })

    await expect(result).toEqual({ statusCode: 500, data: 'Erro Inesperado!' })
  })

  it('should throws if GenerateGetURLUseCase GeneratePreSignedUrlError', async () => {
    useCase.execute.mockRejectedValueOnce(new GeneratePreSignedUrlError())

    const result = await systemUnderTest.handle({ resourceId: 'any_report_id', resourceType: 'any_purpose' })

    await expect(result).toEqual({ statusCode: 400, data: { field: 'attachments', message: 'Erro ao gerar URL Pré-Assinada!' } })
  })
})
