/**
 * @class
 * @extends Error
 * InfraError is a generic error class for infra errors.
 * This class is used to throw errors from the infra layer.
 * HTTP responses that are related to infra errors should be 500.
 * @see {@link http/Helper/HttpHelper.ts/HttpResponse/serverError}
 */
export class InfraError extends Error {
  constructor (readonly message: string) {
    super(message)
    this.name = 'InfraError'
  }
}
