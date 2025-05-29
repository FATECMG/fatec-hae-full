import { GeneratePreSignedPostUrlUseCase } from '@functions/utils/s3urls/usecases/GeneratePostUrl'
import { badRequest, ok, serverError } from '@common/http/Helpers'
import { GenerateUrlUseCaseDTOValidationLocator, GenerateUrlUseCaseLocator } from '@functions/utils/s3urls/shared/Di.enums'
import { type GenerateUrlInterface, type PostURLRequest } from '@functions/utils/s3urls/entities/GeneratePostUrl'
import { NewValidationSchema } from '@common/validation/Validate'
import { type HttpResponse } from '@common/http/Types'

import { type FieldError } from '@common/error/ValidationError'
import { InfraError } from '@common/error/InfraError'

import { inject, injectable } from 'inversify'
import { GeneratePreSignedUrlError } from '@common/error/GeneratePreSignedUrlError'

@injectable()
export class GeneratePostURLController {
  constructor (
    @inject(GenerateUrlUseCaseLocator.GeneratePostURL)
    private readonly entityUseCase: GeneratePreSignedPostUrlUseCase,
    @inject(GenerateUrlUseCaseDTOValidationLocator.GeneratePostURLDTOValidation)
    private readonly dtoValidator: NewValidationSchema

  ) {}

  async handle (params: PostURLRequest): Promise<HttpResponse<FieldError[] | FieldError | GenerateUrlInterface[] | string>> {
    try {
      const validationResult = this.dtoValidator.validate(params)

      if (validationResult !== undefined) {
        return badRequest(validationResult.errors)
      }

      const result = await this.entityUseCase.execute(params)

      if (result instanceof Error) {
        return badRequest({ field: 'attachments', message: result.message })
      }

      return ok(result)
    } catch (error) {
      if (error instanceof GeneratePreSignedUrlError) { return badRequest({ field: 'attachments', message: error.message }) }

      return serverError(new InfraError('Erro inesperado!'))
    }
  }
}
