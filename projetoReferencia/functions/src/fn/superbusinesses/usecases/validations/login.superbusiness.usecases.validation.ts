import Joi from 'joi'
import {
  ValidationResult,
  ValidationSchema,
} from '../../../../shared/decorators/validate'
import { ISuperBusiness } from '../../entities/interfaces.entities'

const LoginSuperBusinessJoi = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})

export class LoginSuperBusinessValidation
  implements ValidationSchema<ISuperBusiness> {
  async validate(
    superBusiness: ISuperBusiness,
  ): Promise<ValidationResult<ISuperBusiness>> {
    return LoginSuperBusinessJoi.validate(superBusiness)
  }
}
