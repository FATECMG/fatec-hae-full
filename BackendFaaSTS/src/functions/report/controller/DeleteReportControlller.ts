import { DeleteController } from "@common/domain/Controllers";
import { DeleteUseCase } from "@common/domain/UseCase.interface";
import { inject, injectable } from "inversify";
import { ReportUseCaseLocator } from "../shared/Di.enums";

@injectable()
export class HandleDeleteReportController extends DeleteController{

    constructor (
        @inject(ReportUseCaseLocator.DeleteReportUseCase) deleteReportUseCase: DeleteUseCase) {
          super(deleteReportUseCase)
        }

}