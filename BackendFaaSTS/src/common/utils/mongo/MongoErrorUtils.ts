import { type MongoServerError } from 'mongodb'

/**
 * Returns the name of the duplicated property that caused the `MongoServerError`.
 * @param {MongoServerError} error - The `MongoServerError` object.
 * @returns {T} The name of the duplicated property.
 */
export function getPropertyNameFromError<T> (error: MongoServerError): T {
  return (Object.keys(error?.keyPattern)[0]) as T
}

/**
 * Returns the translated name of the duplicated property that caused the `MongoServerError`.
 * @param {T} propertyName - The name of the duplicated property.
 * @param {any} errorLabel - The object that contains the translations of the property names.
 * @returns {string} The translated name of the duplicated property.
 */
export function getPropertyTranslation<T> (propertyName: T, errorLabel: any): string {
  const translation = errorLabel[propertyName] ?? undefined
  return translation
}

/**
 * Checks if an error is a `MongoServerError` with code 11000 (duplicated key error).
 * @param {unknown} error - The error object to check.
 * @returns {boolean} `true` if the error is a `MongoServerError` with code 11000, `false` otherwise.
 */

export function isMongoDuplicationError (error: any): error is MongoServerError {
  return error.code === 11000
}
