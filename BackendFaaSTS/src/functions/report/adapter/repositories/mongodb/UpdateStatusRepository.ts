import { connectDatabase } from "@common/external/database/MongoDB"
import { injectable } from "inversify"
import { ReportModel } from "./model/ReportModel"

@injectable()
export class UpdateStatusRepository {
  async perform (id: string, status: string): Promise<boolean> {
    await connectDatabase()
    const report = await ReportModel.findOneAndUpdate({ _id: id, active: true }, {
      $set: { status: status}
    }, { new: true })
    return !(report == null) && report.status === status
  }
}
