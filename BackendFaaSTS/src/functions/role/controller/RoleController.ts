import { InfraError } from '@common/error/InfraError'
import { type HttpResponse } from '@common/http/Types'
import { ok, serverError } from '@common/http/Helpers'

import { type Role } from '@functions/role/entities/Role'
import { type IRoleUseCases } from '@functions/role/useCases/RoleUseCases.interface'
import { RoleLocator } from '@functions/role/shared/Di.enums'

import { inject, injectable } from 'inversify'

type Model = string | Role[]

/**
 * A class that handles HTTP requests related to `Role` entities.
 */
@injectable()
export class RoleController {
  /**
    * Creates a new instance of the `RoleController` class.
    * @param {IRoleUseCases} roleUseCases - An instance of the `IRoleUseCases` interface.
    */
  constructor (@inject(RoleLocator.RoleUseCases) private readonly roleUseCases: IRoleUseCases) {}

  /**
   * Handles a request to find all `Role` entities.
   * @returns {Promise<HttpResponse<Model>>} A `Promise` that resolves to an `HttpResponse` object with an array of `Role` objects if successful, or a `500 Internal Server Error` if an error occurs.
   */
  async handle (): Promise<HttpResponse<Model>> {
    try {
      const response = await this.roleUseCases.findAll()
      return ok<Role[]>(response)
    } catch (error) {
      return serverError(new InfraError(error instanceof Error ? error.message : 'Unexpected Error'))
    }
  }
}
