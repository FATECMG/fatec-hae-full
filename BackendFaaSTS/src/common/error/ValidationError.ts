export type FieldError = {
  field: string
  message: string[] | string
}
/**
 * @class
 * Class that throws field validation errors.
 * Store an array of FieldError.
 * @see
 * - {@link FieldError}
 * - Usage example at: {@link ../src/functions/school/adapter/validation/ZodValidation.ts}
 */
export class ValidationError extends Error {
  constructor (readonly errors: FieldError[]) {
    super('Validation Error!')
    this.name = 'ValidationError'
  }
}
