import { type FieldError } from '@common/error/ValidationError'
import { badRequest, ok, serverError } from '@common/http/Helpers'
import { type HttpResponse } from '@common/http/Types'
import { type GenerateUrlInterface, type GenerateUrlRequest } from '../entities/GeneratePostUrl'
import { GeneratePreSignedUrlGetUseCase } from '../usecases/GenerateGetUrl'

import { GenerateUrlUseCaseLocator } from '@functions/utils/s3urls/shared/Di.enums'

import { inject, injectable } from 'inversify'
import { InfraError } from '@common/error/InfraError'
import { GeneratePreSignedUrlError } from '@common/error/GeneratePreSignedUrlError'

@injectable()
export class GenerateGetURLController {
  constructor (
    @inject(GenerateUrlUseCaseLocator.GenerateGetURL)
    private readonly getPreAssignedGetURLs: GeneratePreSignedUrlGetUseCase
  ) {}

  async handle (params: GenerateUrlRequest): Promise<HttpResponse<FieldError[] | FieldError | GenerateUrlInterface[] | string>> {
    try {
      const result = await this.getPreAssignedGetURLs.execute(params)

      if (result instanceof Error) {
        return badRequest({ field: 'attachments', message: result.message })
      }

      return ok(result)
    } catch (error) {
      if (error instanceof GeneratePreSignedUrlError) { return badRequest({ field: 'attachments', message: error.message }) }

      return serverError(new InfraError('Erro Inesperado!'))
    }
  }
}
