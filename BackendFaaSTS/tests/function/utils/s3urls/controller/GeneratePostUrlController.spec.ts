import 'reflect-metadata'

import { type NewValidationSchema } from '@common/validation/Validate'
import { GeneratePostURLController } from '@functions/utils/s3urls/controller/GeneratePostUrlController'
import { type GeneratePreSignedPostUrlUseCase } from '@functions/utils/s3urls/usecases/GeneratePostUrl'
import { type MockProxy, mock } from 'jest-mock-extended'
import { ValidationError } from '@common/error/ValidationError'
import { GeneratePreSignedUrlError } from '@common/error/GeneratePreSignedUrlError'

describe.only('GeneratePostUrl Controller', () => {
  let systemUnderTest: GeneratePostURLController
  let useCase: MockProxy<GeneratePreSignedPostUrlUseCase>
  let validationSchema: MockProxy<NewValidationSchema>

  beforeAll(() => {
    validationSchema = mock()

    useCase = mock()
    useCase.execute.mockResolvedValue([{ url: 'any_url' }])

    systemUnderTest = new GeneratePostURLController(useCase, validationSchema)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should returns an array string', async () => {
    const result = await systemUnderTest.handle({ resourceId: 'any_report_id', resourceType: 'any_purpose', quantity: 1 })

    expect(result).toEqual({ statusCode: 200, data: [{ url: 'any_url' }] })
  })

  it('should throws if GeneratePostURLUseCase throws', async () => {
    useCase.execute.mockRejectedValueOnce(new GeneratePreSignedUrlError())

    const result = await systemUnderTest.handle({ resourceId: 'any_report_id', resourceType: 'any_purpose', quantity: 1 })

    await expect(result).toEqual({ statusCode: 400, data: { field: 'attachments', message: 'Erro ao gerar URL Pré-Assinada!' } })
  })

  it('should calls validationSchema with correct params', async () => {
    await systemUnderTest.handle({ resourceId: 'any_report_id', resourceType: 'any_resource_type', quantity: 1 })

    expect(validationSchema.validate).toHaveBeenCalledTimes(1)
    expect(validationSchema.validate).toHaveBeenCalledWith({ resourceId: 'any_report_id', resourceType: 'any_resource_type', quantity: 1 })
  })

  it('should throws if validationSchema throws if quantity is 0', async () => {
    validationSchema.validate.mockImplementationOnce(jest.fn(() => new ValidationError([{ field: 'any_field', message: 'any_error' }])))

    const result = await systemUnderTest.handle({ resourceId: 'any_report_id', resourceType: 'any_purpose', quantity: 1 })

    expect(result).toEqual({ statusCode: 400, data: [{ field: 'any_field', message: 'any_error' }] })
  })

  it('should throws if validationSchema throws if quantity is below 0', async () => {
    validationSchema.validate.mockImplementationOnce(jest.fn(() => new ValidationError([{ field: 'any_field', message: 'any_error' }])))

    const result = await systemUnderTest.handle({ resourceId: 'any_report_id', resourceType: 'any_purpose', quantity: 1 })

    await expect(result).toEqual({ statusCode: 400, data: [{ field: 'any_field', message: 'any_error' }] })
  })
})
