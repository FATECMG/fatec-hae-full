import { connectDatabase } from "@common/external/database/MongoDB"
import { FindOneEntityRepository } from "@common/repository/RepositoryInterface"
import { Report } from "@functions/report/entities/Report"
import { injectable } from "inversify"
import { ReportModel } from "./model/ReportModel"
import { toDomain } from "@common/utils/mongo/MongoMapperUtils"

@injectable()
export default class FindOneReportMongoRepository implements FindOneEntityRepository<Report> {
  async perform (id: string): Promise<Report | undefined> {
    await connectDatabase()
    const result = await ReportModel.findOne({ _id: id });
    return result === null ? undefined : toDomain<Report>(result)
  }
}
