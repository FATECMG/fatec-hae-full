import Joi from 'joi'
import JoiDate from '@joi/date'
import {
  ValidationResult,
  ValidationSchema,
} from '../../../../shared/decorators/validate'
import { IBusiness } from '../../entities/interfaces.entity'
import {
  generateError,
  generateValidResult,
} from '../../../../shared/utils/validations'
import { container } from '../../shared/di.container'
import { IBusinessRepository } from '../../adapters/repositories/interfaces.repository'
import { Locator } from '../../shared/di.enums'
const ExtendedJoi = Joi.extend(JoiDate)
const JoiObject = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().min(3).required(),
  cnpj: Joi.string().min(18).optional(),
  cpf: Joi.string().min(14).max(14).required(),
  phone: Joi.string().min(14).required(),
  contract: Joi.object({
    plan: Joi.object({
      id: Joi.string().required(),
    }).required(),
  }),
  type: Joi.string().valid('Business').required(),
  createdBy: Joi.object({
    text: Joi.string().valid('self', 'admin').required(),
    user: Joi.object({
      _id: Joi.string().required(),
    }),
  }).required(),
  address: Joi.object({
    text: Joi.string().required(),
    placeId: Joi.string().required(),
  }).required(),
  birthDate: ExtendedJoi.date().format('DD-MM-YYYY').raw(),
  bank: Joi.object({
    number: Joi.string().min(3).max(3),
    account: Joi.string(),
    agency: Joi.string(),
  }),
})

const JoiForSuperB = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().min(3).required(),
  phone: Joi.string().min(14).required(),
  type: Joi.string()
    .valid('Business', 'SuperBusiness', 'Administrador')
    .required(),
  createdBy: Joi.object({
    text: Joi.string().valid('self', 'admin').required(),
    user: Joi.object({
      id: Joi.string().required(),
    }),
  }),
})

export default class BusinessValidation implements ValidationSchema<IBusiness> {
  async validate(args: IBusiness): Promise<ValidationResult<IBusiness>> {
    if (!args.type) {
      return generateError('Tipo de usuário é obrigatório.')
    }
    const { createdBy: { text, user } = { text: '', user: {} }, type } = args
    if (type === 'Business') {
      const validationResult = JoiObject.validate(args)
      if (validationResult.error) {
        return validationResult
      }
      if (text === 'admin' && !user) {
        return generateError('Não encontramos o adm responsável.')
      }
    } else if (type === 'Administrador' && text !== 'admin') {
      return generateError('Apenas adm cria adm.')
    } else if (type === 'SuperB' && text !== 'admin') {
      return generateError('Apenas adm cria superbusinesses.')
    } else if (type === 'SuperB' && text === 'admin') {
      const validationResult = JoiForSuperB.validate(args)
      if (validationResult.error) {
        return validationResult
      }
    }

    const businessRepository = container.get<IBusinessRepository>(
      Locator.BusinessRepository,
    )
    const existentUser = await businessRepository.checkUserExistsByParams({
      email: args.email,
      cpf: args.cpf,
    })
    if (existentUser) {
      if (existentUser.email === args.email) {
        return generateError('Email já cadastrado 🧐')
      } else if (existentUser.cpf === args.cpf) {
        return generateError('CPF já cadastrado 🧐')
      }
    }

    return generateValidResult(args)
  }
}
