import { inject, injectable } from 'inversify'
import { ReportMapperLocator, ReportUseCaseLocator } from '@functions/report/shared/Di.enums'
import { FindAllUseCase, FindOneUseCase } from '@common/domain/UseCase.interface'
import { type Report } from '@functions/report/entities/Report'
import { type ReportPM } from '@functions/report/entities/pm/ReportPM'
import { ok, serverError, unauthenticated } from '@common/http/Helpers'
import { IDNotFoundError } from '@common/error/NotFoundError'
import { AuthenticatorLocator } from '@functions/auth/shared/Di.enums'
import { RoleEnum, type User } from '@functions/user/entities/User'
import { UserLocator } from '@functions/user/shared/Di.enums'

import { type HttpResponse } from '@common/http/Types'
import { AuthenticationService } from '@common/auth/AuthenticationService.interface'
import { GeneratePreSignedURL } from '@common/s3url/GeneratePreSignedURL'

@injectable()
export class FindAllExistingByAuthorReportsController {
  constructor (
    @inject(ReportUseCaseLocator.FindAllExistingByAuthorReportsUseCase)
    private readonly findAllReports: FindAllUseCase<Report>,
    @inject(ReportMapperLocator.ReportPresentationModelMapper)
    private readonly mapper: any,
    @inject(AuthenticatorLocator.CognitoAuthenticationService)
    private readonly authService: AuthenticationService,
    @inject(UserLocator.UserFindOneUseCase)
    private readonly findUserById: FindOneUseCase<User>,
  ) {}

  async handle (token: string): Promise<HttpResponse< ReportPM[] | string>> {
    try {
      const user = await this.getUserByToken(token)


      this.isUserAllowedToAccessResource(user)

      const reports = await this.findAllReports.execute(true)

      const s3Cliente = new GeneratePreSignedURL()

      const filteredReports = this.filterReportsByAuthor(user.id, reports)

      const presentation = await Promise.all(filteredReports.map(async (report) => {
        const files = await s3Cliente.getPreSignedGetURLs(`reports/${report.project.id}`)
        return this.mapper.execute(report, files)
      }))

      return ok(presentation)
    } catch (error) {
      if (error instanceof IDNotFoundError) {
        return unauthenticated('Houve um erro com a autenticação!')
      }

      return serverError(error as Error)
    }
  }

  private isUserAllowedToAccessResource (user: User): undefined | Error {

    const userIsProfessor = this.userIsProfessor(user.roles)

    if (!userIsProfessor) {
      throw new IDNotFoundError('invalid_id', 'user')
    }
    
    return undefined
  }

  private async getUserByToken (token: string): Promise<User> {
    const userData = await this.authService.getUserByToken({ accessToken: token })

    if (userData instanceof Error || userData.id === undefined) {
      throw new IDNotFoundError('invalid_id', 'user')
    }

    const user = await this.findUserById.execute(userData.id)

    if (user instanceof Error) {
      throw new IDNotFoundError(userData.id, 'user')
    }

    return user
  }


  private userIsProfessor (roles: string): boolean {
    return roles === RoleEnum.PROFESSOR
  }

  private filterReportsByAuthor (authorId: string, reports: Report[]): Report[] {
    return reports
      .filter(report => report.author.id === authorId)
  }

}
