import { getPropertyNameFromError, getPropertyTranslation } from '@common/utils/mongo/MongoErrorUtils'

import { type MongoServerError } from 'mongodb'

type DuplicatedFieldErrorParams<T> = {
  mongoError: MongoServerError
  errorLabel: any
  entity: T
  possibleDuplicatedFields: any
}

/**
 * An error class that represents a duplicated field error in a MongoDB operation.
 * @template T - The type of the entity that caused the error.
 */
export class DuplicatedFieldError<T> extends Error {
  readonly field: string
  /**
   * Creates a new instance of the `DuplicatedFieldError` class.
   * @param {object} params - An object that contains the parameters for the error.
   * @param {MongoServerError} params.mongoError - The `MongoServerError` object that caused the error.
   * @param {any} params.errorLabel - The object that contains the translations of the property names.
   * @param {T} params.entity - The entity that caused the error.
   * @param {any} params.possibleDuplicatedFields - An object that contains the possible duplicated fields.
   */
  constructor ({ mongoError, errorLabel, entity, possibleDuplicatedFields }: DuplicatedFieldErrorParams<T>) {
    const propertyName = getPropertyNameFromError<typeof possibleDuplicatedFields>(mongoError)
    const translatedProperty = getPropertyTranslation(propertyName, errorLabel)
    super(DuplicatedFieldError.generateErrorMessage(translatedProperty, entity, propertyName))
    this.field = propertyName
    this.name = 'DuplicatedFieldError'
  }

  /**
   * Generates the error message for the `DuplicatedFieldError` class.
   * @template E - The type of the entity that caused the error.
   * @param {string} translatedProperty - The translated name of the duplicated property.
   * @param {E} entity - The entity that caused the error.
   * @param {keyof E} propertyName - The name of the duplicated property.
   * @returns {string} The error message.
   */
  static generateErrorMessage<E> (translatedProperty: string, entity: E, propertyName: keyof E): string {
    let message = 'Foram enviados dados duplicados!'
    if (translatedProperty !== undefined) {
      const value = entity[propertyName] as string
      message = `${translatedProperty} ${value} já existe!`
    }
    return message
  }
}
