import { ValidationError, type FieldError } from '@common/error/ValidationError'
import { type HttpResponse } from '@common/http/Types'
import { TransformerComposite } from '@common/utils/transformer/TransformerComposite'
import { TransformerBuilder } from '@common/utils/transformer/TransformerBuilder'
import { badRequest, ok, serverError, unauthorized } from '@common/http/Helpers'
import { NewValidationSchema } from '@common/validation/Validate'
import { getUpperCase } from '@common/utils/transformer/upperCase/Factory'
import { AuthenticationError } from '@common/error/AuthenticationError'

import { AuthenticateUseCase } from '@functions/auth/useCases/Interface'
import { type AuthRequest } from '@functions/auth/entities/AuthRequest'
import { AuthLocator } from '@functions/auth/shared/Di.enums'

import { inject, injectable } from 'inversify'
import { type AuthTokenResponse } from '../entities/AuthTokenResponse'

@injectable()
export class AuthController {
  private readonly transformers: TransformerComposite

  constructor (
    @inject(AuthLocator.AuthValidation) private readonly dtoValidator: NewValidationSchema,
    @inject(AuthLocator.AuthUseCase) private readonly entityUseCase: AuthenticateUseCase
  ) {
    this.transformers = this.buildTransformers()
  }

  async handle (object: AuthRequest): Promise<HttpResponse<FieldError[] | FieldError | string | AuthTokenResponse>> {
    const validationResult = this.dtoValidator.validate(object)
    if (validationResult !== undefined) {
      return badRequest(validationResult.errors)
    }
    const param = this.transformers.execute(object)
    param.email = getUpperCase().execute(param.email)
    try {
      const result = await this.entityUseCase.execute(param.email, param.password)
      if (result instanceof Error) {
        if (result instanceof AuthenticationError) {
          return unauthorized(result.message)
        }

        if (result instanceof ValidationError) {
          return badRequest(result.errors)
        }
      } else {
        return ok(result)
      }
      return serverError(new Error('Erro inesperado!'))
    } catch (err) {
      return serverError(new Error('Erro inesperado!'))
    }
  }

  /**
 * Builds a composite transformer that applies a series of transformations to a string.
 * @returns {TransformerComposite} A `TransformerComposite` object that applies the transformations.
 */
  private buildTransformers (): TransformerComposite {
    return new TransformerComposite(TransformerBuilder.of()
      .emojiParser()
      .stringTrimmer()
      .spaceNormalizer()
      .build()
    )
  }
}
