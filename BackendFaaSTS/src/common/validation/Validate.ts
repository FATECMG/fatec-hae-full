import { type ValidationError } from '@common/error/ValidationError'

/**
 * @interface
 * Interface utlilizada para implementações de validações de schema, a interface recebe o tipo que será validado
 * por meio de um genérico T.
 * Possui apenas um método que retorna um booleano sobre o sucesso da validação do valor de entrada.
 */
export interface ValidationSchema<T> {
  validate: (args: T) => boolean
}

export interface NewValidationSchema {
  /**
   * Validates the given arguments against the schema.
   * @param {any} args - The arguments to validate.
   * @returns {undefined | ValidationError} `undefined` if the arguments are valid, or a `ValidationError` object if the arguments are invalid.
   */
  validate: (args: any) => undefined | ValidationError
}
