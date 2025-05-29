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
export class FindAllExistingNonDraftReportsController {
  constructor (
    @inject(ReportUseCaseLocator.FindAllExistingNonDraftReportsUseCase)
    private readonly findAllReports: FindAllUseCase<Report>,
    @inject(ReportMapperLocator.ReportPresentationModelMapper)
    private readonly mapper: any,
    @inject(AuthenticatorLocator.CognitoAuthenticationService)
    private readonly authService: AuthenticationService,
    @inject(UserLocator.UserFindOneUseCase)
    private readonly findUserById: FindOneUseCase<User>
  ) {}

  async handle (token: string): Promise<HttpResponse< ReportPM[] | string>> {
    try {
      const user = await this.getUserByToken(token)

      this.isUserAllowedToAccessResource(user)

      const reports = await this.findAllReports.execute(true)

      let presentation: any = []

      const userIsCoordinator = this.userIsCoordinator(user.roles)

      const s3Cliente = new GeneratePreSignedURL()

      console.log("FindAllExistingNonDraftReportsController 43:", reports)

      if (userIsCoordinator) {
        const coordinatorCourseId: string[] = this.getCoursesIdByUser(user)
        const reportsFilteredByCourse = this.filterReportsFromCoordinatorCourses(coordinatorCourseId, reports)

         presentation = await Promise.all(reportsFilteredByCourse.map(async (report) => {
          const files = await s3Cliente.getPreSignedGetURLs(`reports/${report.project.id}`)
          return this.mapper.execute(report, files)
        }))
      } else {
        presentation = await Promise.all(reports.map(async (report) => {
          const files = await s3Cliente.getPreSignedGetURLs(`reports/${report.project.id}`)
          return this.mapper.execute(report, files)
        }))
      }

      return ok(presentation)
    } catch (error) {
      if (error instanceof IDNotFoundError) {
        return unauthenticated('Houve um erro com a autenticação!')
      }

      return serverError(error as Error)
    }
  }

  private isUserAllowedToAccessResource (user: User): undefined | Error {
    const userIsDirector = this.userIsDirector(user.roles)

    const userIsCoordinator = this.userIsCoordinator(user.roles)

    if (!(userIsDirector || userIsCoordinator)) {
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

  private userIsDirector (roles: string): boolean {
    return (roles === RoleEnum.DIRECTOR || roles === RoleEnum.ACADEMICDIRECTOR)
  }

  private userIsCoordinator (roles: string): boolean {
    return roles === RoleEnum.COORDINATOR
  }

  private filterReportsFromCoordinatorCourses (coordinatorCourseId: string[], reports: Report[]): Report[] {
    return reports
      .filter(report => coordinatorCourseId.includes(report.course))
  }

  private getCoursesIdByUser (user: User): string[] {
    return user.courses.map(eachCourse => eachCourse.id)
  }
}
