import { AuthenticationService } from "@common/auth/AuthenticationService.interface"
import { UpdateStatusUseCase } from "../UseCase.interface"
import { Mapper } from "@common/mapper/BaseMapper"
import { HttpResponse } from "@common/http/Types"
import { FieldError } from "@common/error/ValidationError"
import { InvalidRangeDate } from "@common/error/InvalidDate"
import { StatusError } from "@common/error/StatusError"
import { badRequest, notFound, ok, serverError } from "@common/http/Helpers"
import { NotFoundError } from "@common/error/NotFoundError"
import { InfraError } from "@common/error/InfraError"
import { injectable } from "inversify"

@injectable()
export default abstract class UpdateStatusController<E, P> {
      constructor (
        private readonly updateStatus: UpdateStatusUseCase<E>,
        private readonly entityToPresentationModelMapper: Mapper<E, P>,
        private readonly authService: AuthenticationService

  ) {}

  async handle (id: string, status: string, token: string): Promise<HttpResponse<P | FieldError | FieldError[] | string>> {
    let result

    try {
      const userRole = await this.getUserRoleByToken(token)

      if (userRole instanceof Error) {
        return badRequest('Houve um erro com a autenticação!')
      }

      result = await this.updateStatus.execute({ id, status, role: userRole })

      if (result instanceof Error) {
        if (result instanceof StatusError || result instanceof InvalidRangeDate) {
          return badRequest({ field: result.field, message: result.message })
        }
        if (result instanceof NotFoundError) {
          return notFound({ field: result.field, message: result.message })
        }
      } else {
        return ok(await this.entityToPresentationModelMapper.execute(result))
      }
      return serverError(new Error('Erro inesperado!'))
    } catch (error) {
      return serverError(new InfraError('Erro inesperado!'))
    }
  }

  private async getUserRoleByToken (token: string): Promise<string | Error> {
    try {
      const userData = await this.authService.getUserByToken({ accessToken: token })

      if (userData instanceof Error) {
        throw new InfraError('Erro inesperado!')
      }

      if (userData.role === undefined) {
        throw new InfraError('Erro inesperado!')
      }

      return userData.role
    } catch (error) {
      return new InfraError('Erro inesperado!')
    }
  }
}