import { type PasswordValidatorUseCase } from '@functions/passwordvalidation/usecases/PasswordValidation'
import { type HttpResponse } from '@common/http/Types'
import { type FieldError, ValidationError } from '@common/error/ValidationError'
import { badRequest, ok, serverError } from '@common/http/Helpers'

export class PasswordValidatorController {
  private readonly passwordValidatorUseCase: PasswordValidatorUseCase
  constructor (passwordValidator: PasswordValidatorUseCase) {
    this.passwordValidatorUseCase = passwordValidator
  }

  async handle (password: string): Promise<HttpResponse<FieldError[] | FieldError | string | boolean >> {
    const response = await this.passwordValidatorUseCase.execute(password)
    if (response instanceof ValidationError) {
      return badRequest(response.errors)
    } else if (response instanceof Error) {
      return serverError(response)
    } else {
      return ok(response)
    }
  }
}
