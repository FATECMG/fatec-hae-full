import { connectDatabase } from '@common/external/database/MongoDB'
import { type FindAllEntityRepository } from '@common/repository/RepositoryInterface'
import { type Report } from '@functions/report/entities/Report'
import { ReportModel } from './model/ReportModel'
import { Status } from '@functions/report/entities/enums/ReportEnums'
import { toDomain } from './utils/toDomain'

import { injectable } from 'inversify'

/**
 * A repository class that finds all `Report` entities that are are active and not in draft status.
 * @implements {FindAllEntityRepository}
 */
@injectable()
export class FindAllExistingByAuthorReportsRepository implements FindAllEntityRepository<Report> {
  constructor () {}

  async perform (active: boolean): Promise<Report[]> {
    await connectDatabase()

    const reports = await ReportModel.find(
      {
        $and: [
          { active },
        ]
      }
    )

    return reports.map(eachDoc => toDomain(eachDoc))
  }
}
