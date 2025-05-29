import { type Address } from '@functions/address/entities/Address'

/**
 * Interface that defines the use cases for retrieving address information.
 */
export interface AddressUseCases {
  /**
     * Retrieves address information for a given Brazilian postal code.
     * @param id - A string representing a Brazilian postal code.
     * @returns A Promise that resolves to an Address object with the address information, or an Error object if the request fails.
     */
  getAddress: (id: string) => Promise<Address | Error>
}
