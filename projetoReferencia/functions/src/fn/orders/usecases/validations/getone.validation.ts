import Joi from 'joi'
import {
  ValidationResult,
  ValidationSchema,
} from '../../../../shared/decorators/validate'
import { generateValidResult } from '../../../../shared/utils/validations'
import { IOrder } from '../../entities/interfaces'

const GetOneValidationJoi = Joi.object({
  _id: Joi.string().required(),
})

export class GetOneValidation implements ValidationSchema<IOrder> {
  async validate(order: IOrder): Promise<ValidationResult<IOrder>> {
    const result = GetOneValidationJoi.validate(order)
    if (result.error) {
      return result
    }
    return generateValidResult(order)
  }
}
