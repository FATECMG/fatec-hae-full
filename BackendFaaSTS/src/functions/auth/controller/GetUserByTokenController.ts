import { type FieldError } from '@common/error/ValidationError'
import { type HttpResponse } from '@common/http/Types'
import { badRequest, ok, serverError, unauthorized } from '@common/http/Helpers'
import { AuthenticationError } from '@common/error/AuthenticationError'
import { NewValidationSchema } from '@common/validation/Validate'

import { AuthLocator } from '@functions/auth/shared/Di.enums'
import { GetUserByTokenUseCase } from '@functions/auth/useCases/GetUserByTokenUseCase'
import { type UserDataResponse } from '@functions/auth/entities/AuthUserDataResponse'
import { type UserDataRequest } from '@functions/auth/entities/AuthUserDataRequest'

import { inject, injectable } from 'inversify'

@injectable()
export class GetUserByTokenController {
  constructor (
    @inject(AuthLocator.RequestUserDataValidation) private readonly dtoValidator: NewValidationSchema,
    @inject(AuthLocator.GetUserByTokenUseCase) private readonly entityUseCase: GetUserByTokenUseCase
  ) {}

  async handle (accessToken: UserDataRequest): Promise<HttpResponse<FieldError[] | FieldError | string | UserDataResponse>> {
    const validationResult = this.dtoValidator.validate(accessToken)
    if (validationResult !== undefined) {
      return badRequest(validationResult.errors)
    }

    try {
      const result = await this.entityUseCase.execute(accessToken)
      if (result instanceof Error) {
        if (result instanceof AuthenticationError) {
          return unauthorized(result.message)
        }
      } else {
        return ok(result)
      }
      return serverError(new Error('Erro inesperado!'))
    } catch (error) {
      return serverError(new Error('Erro inesperado!'))
    }
  }
}
