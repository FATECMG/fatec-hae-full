export type ValidationResult<T> = { value: T; error?: { message: string } }

export interface ValidationSchema<T> {
  validate: (args: T) => Promise<ValidationResult<T>>
}

export function validate<T>(schema: ValidationSchema<T>) {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const currentMethod = descriptor.value
    descriptor.value = async function (...args: T[]) {
      const result = await schema.validate(args[0])
      if (!result.value) {
        if (result.error) {
          throw new Error(result.error.message)
        }
        throw new Error(`validation error in ${target} -> ${propertyKey}`)
      }
      if (result.error) {
        throw new Error(result.error.message)
      }
      return currentMethod.apply(this, args)
    }
    return descriptor
  }
}
