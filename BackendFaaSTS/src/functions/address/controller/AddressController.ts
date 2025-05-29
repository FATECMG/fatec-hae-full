import { badRequest, serverError, ok } from '@common/http/Helpers'
import { NewValidationSchema } from '@common/validation/Validate'
import { type FieldError } from '@common/error/ValidationError'
import { type HttpResponse } from '@common/http/Types'

import { type AddressUseCases } from '@functions/address/useCases/AddressUseCases.interface'
import { AddressLocator } from '@functions/address/shared/Di.enums'
import { type Address } from '@functions/address/entities/Address'

import { inject, injectable } from 'inversify'

/**
 * AddressController class that handles requests related to addresses.
 * @class
 */
@injectable()
export class AddressController {
  /**
     * Creates an instance of AddressController.
     * @constructor
     * @param {AddressUseCases} addressUseCases - An instance of AddressUseCases.
     * @param {NewValidationSchema} addressValidation - An instance of NewValidationSchema.
     */
  constructor (
    @inject(AddressLocator.AddressUseCases) private readonly addressUseCases: AddressUseCases,
    @inject(AddressLocator.AddressValidation) private readonly addressValidation: NewValidationSchema
  ) {}

  /**
   * Handles a request to retrieve address information for a given Brazilian postal code.
   * @param id - A string representing a Brazilian postal code.
   * @returns A Promise that resolves to an HttpResponse object with the address information, or an error message if the request fails.
   */
  async handle (id: string): Promise<HttpResponse<Address | string | FieldError[]>> {
    const validation = this.addressValidation.validate(id)
    if (validation !== undefined) {
      return badRequest(validation.errors)
    }
    try {
      const result = await this.addressUseCases.getAddress(id)
      return result instanceof Error ? badRequest(result.message) : ok(result)
    } catch (error) {
      return error instanceof Error ? serverError(error) : serverError(new Error('Erro inesperado'))
    }
  }
}
