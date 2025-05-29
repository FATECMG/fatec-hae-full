import { inject, injectable } from "inversify"
import { ReportRepositoryLocator } from "../shared/Di.enums"

import { StatusUtil } from "@common/utils/status/StatusUtil"
import { Role } from "@functions/role/entities/Role"
import { StatusNotUpdated, StatusNotValid, StatusNotValidChange } from "@common/error/StatusError"
import { IDNotFoundError } from "@common/error/NotFoundError"
import { InvalidRangeDate } from "@common/error/InvalidDate"
import { InfraError } from "@common/error/InfraError"
import { Report } from "../entities/Report"
import { FindOneEntityRepository } from "@common/repository/RepositoryInterface"
import { UpdateStatusRepository } from "../adapter/repositories/mongodb/UpdateStatusRepository"
import { UpdateStatusUseCase, UpdateStatusUseCaseProps } from "@common/domain/UseCase.interface"
import FindOneReportMongoRepository from "../adapter/repositories/mongodb/FindOneReportById"

@injectable()
export class UpdateReportStatusUseCase implements UpdateStatusUseCase<Report> {
constructor (
    @inject(ReportRepositoryLocator.UpdateStatusRepository) private readonly updateStatus: UpdateStatusRepository,
    @inject(ReportRepositoryLocator.FindOneReportByProjectIdRepository) private readonly findOne: FindOneEntityRepository<Report>,
    // @inject(NoticeRepositoryLocator.NoticeFindOneRepository) private readonly findNotice: FindOneEntityRepository<Notice>
  ) {}

  async execute (props: UpdateStatusUseCaseProps): Promise<Report | Error> {
    try {

      const repository = new FindOneReportMongoRepository()

      const report = await repository.perform(props.id)

      StatusUtil.validateStatus(props.status)

      const isRestricted = Role.isRestricted(props.role)

      if (isRestricted) {
        StatusUtil.throwErrorIfInvalidStatusChange(report.status, props.status)
      }
      console.log("UpdateReportStatusUseCase 39, relatório: ", report)

      report.status = props.status
      const result = await this.updateStatus.perform(props.id, props.status)

      console.log("UpdateReportStatusUseCase 44")
      if (!result) throw new StatusNotUpdated()

      console.log("UpdateReportStatusUseCase 45")
      return report
    } catch (error) {
      if (error instanceof IDNotFoundError) {
        return new IDNotFoundError(error.id, 'Relatório')
      }

      if (error instanceof StatusNotValid) {
        return new StatusNotValid()
      }

      if (error instanceof StatusNotValidChange) {
        return new StatusNotValidChange()
      }

      if (error instanceof StatusNotUpdated) {
        return new StatusNotUpdated()
      }
      if (error instanceof InvalidRangeDate) {
        return new InvalidRangeDate(error.field, error.message)
      }
    }

    return new InfraError('Erro inesperado!')
  }


  private async findReportOrThrowError (id: string): Promise<Report> {
    const report = await this.findOne.perform(id)
    if (report == null) throw new IDNotFoundError(id, 'Relatório')
    return report
  }
}