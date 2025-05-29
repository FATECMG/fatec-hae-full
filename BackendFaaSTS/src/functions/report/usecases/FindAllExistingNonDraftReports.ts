import { type FindAllUseCase } from '@common/domain/UseCase.interface'
import { type Report } from '@functions/report/entities/Report'
import { FindAllEntityRepository } from '@common/repository/RepositoryInterface'
import { inject, injectable } from 'inversify'
import { ReportRepositoryLocator } from '@functions/report/shared/Di.enums'

@injectable()
export class FindAllExistingNonDraftReportsUseCase implements FindAllUseCase<Report> {
  constructor (
    @inject(ReportRepositoryLocator.FindAllExistingNonDraftReportsRepository)
    private readonly findAll: FindAllEntityRepository<Report>
  ) {}

  async execute (): Promise<Report[]> {
    try {
      return await this.findAll.perform(true)
    } catch (err) {
      throw err
    }
  }
}
