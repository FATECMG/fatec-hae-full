import { PasswordPolicyValidator } from '@functions/passwordvalidation/adapter/validation/PasswordPolicy'
import { ValidationError } from '@common/error/ValidationError'

describe('PasswordPolicy Validator', () => {
  let password: string

  it('should throw an error when password has less than 8 characters', () => {
    password = 'any'

    expect(() => PasswordPolicyValidator.validate(password)).toThrow(new ValidationError([{
      field: 'password',
      message: 'A senha deve conter no minímo 8 caracteres'
    }]))
  })

  it('should throw an error when password has more than 64 characters', () => {
    password = 'any'.repeat(64) + 1

    expect(() => PasswordPolicyValidator.validate(password)).toThrow(new ValidationError([{
      field: 'password',
      message: 'A senha deve conter no maxímo 64 caracteres(s)'
    }]))
  })

  it('should throw an error when password has less than 1 lower case character', () => {
    password = 'ANYPASSWORD123@'

    expect(() => PasswordPolicyValidator.validate(password)).toThrow(new ValidationError([{
      field: 'password',
      message: 'A senha deve conter no minímo 1 carectere(s) minúsculo'
    }]))
  })

  it('should throw an error when password has less than 1 upper case character', () => {
    password = 'anypassword123@'

    expect(() => PasswordPolicyValidator.validate(password)).toThrow(new ValidationError([{
      field: 'password',
      message: 'A senha deve conter no minímo 1 carectere(s) maiúsculo'
    }]))
  })

  it('should throw an error when password has less than 1 number character', () => {
    password = 'AnyPassword@'

    expect(() => PasswordPolicyValidator.validate(password)).toThrow(new ValidationError([{
      field: 'password',
      message: 'A senha deve conter no minímo 1 carectere(s) numérico'
    }]))
  })

  it('should throw an error when password has less than 1 symbol character', () => {
    password = 'AnyPassword123'

    expect(() => PasswordPolicyValidator.validate(password)).toThrow(new ValidationError([{
      field: 'password',
      message: 'A senha deve conter no minímo 1 carectere(s) especial'
    }]))
  })

  it('should throw an error when password is empty', () => {
    password = ''

    expect(() => PasswordPolicyValidator.validate(password)).toThrow(new ValidationError([{
      field: 'password',
      message: 'A senha é obrigatória'
    }]))
  })

  it('should return true when password is valid', () => {
    password = 'AnyPassword123@'

    expect(() => PasswordPolicyValidator.validate(password)).not.toThrow()
  })
})
