import { ValidationResult } from '../decorators/validate'

export function generateError<T>(
  message = 'unknown error',
): ValidationResult<T> {
  return {
    value: {} as T,
    error: {
      message,
    },
  }
}

export function generateValidResult<T>(args: T): ValidationResult<T> {
  return {
    value: args,
  }
}
