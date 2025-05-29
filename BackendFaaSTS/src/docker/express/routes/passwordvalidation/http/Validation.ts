import { type FieldError } from '@common/error/ValidationError'
import { type HttpResponse } from '@common/http/Types'
import { PasswordValidatorController } from '@functions/passwordvalidation/controller/PasswordValidatorController'
import { PasswordValidatorUseCase } from '@functions/passwordvalidation/usecases/PasswordValidation'

const postController = new PasswordValidatorController(new PasswordValidatorUseCase())

export const PasswordValidationHandler = async (req: any): Promise<HttpResponse<FieldError[] | FieldError | string | boolean >> => {
  const request = req.body.password
  const response = await postController.handle(request)
  return { data: response.data, statusCode: response.statusCode }
}
