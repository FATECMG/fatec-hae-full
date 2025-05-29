import Joi from 'joi'
import {
  ValidationResult,
  ValidationSchema,
} from '../../../../shared/decorators/validate'
import { IItemEntity } from '../../entities/item.entity'

const JoiSchema = Joi.array()
  .items({
    name: Joi.string().required(),
    description: Joi.string().empty(''),
    type: Joi.string()
      .valid(
        'Alimentício',
        'Bebida Comum',
        'Bebida Alcoólica',
        'Composto',
        'Característico',
      )
      .required()
      .error(new Error('Tipo inválido')),
    hasPhotos: Joi.boolean().default(false),
    typesOfConsumption: Joi.array(),
    photos: Joi.array().default([]),
    prepareTime: Joi.number(),
    prepareEnv: Joi.string(),
    complements: Joi.array(),
    subItems: Joi.array(),
    stockControl: Joi.string(),
    business: Joi.string().required(),
    alias: Joi.string().empty(''),
  })
  .required()

export class ValidateManyItemCreation
  implements ValidationSchema<IItemEntity[]> {
  async validate(
    args: IItemEntity[],
  ): Promise<ValidationResult<IItemEntity[]>> {
    return JoiSchema.validate(args)
  }
}
