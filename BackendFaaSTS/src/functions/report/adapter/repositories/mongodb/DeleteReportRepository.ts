import { connectDatabase } from "@common/external/database/MongoDB";
import { DeleteEntityRepository } from "@common/repository/RepositoryInterface";
import { injectable } from "inversify";
import { ReportModel } from "./model/ReportModel";

@injectable()
export class DeleteReportRepository implements DeleteEntityRepository{

    async perform (id: string): Promise<boolean> {
        await connectDatabase()
        const deleted = await ReportModel.findOneAndDelete({ _id: id})
        return deleted !== null
      }
}