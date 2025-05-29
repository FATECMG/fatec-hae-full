import { UpdateStatusController } from "@common/domain/Controllers";
import { ReportPM } from "../entities/pm/ReportPM";
import { Report } from "../entities/Report";
import { inject, injectable } from "inversify";
import { ReportMapperLocator, ReportUseCaseLocator } from "../shared/Di.enums";
import { AuthenticatorLocator } from "@functions/auth/shared/Di.enums";
import { UpdateReportStatusUseCase } from "../usecases/UpdateReportStatusUseCase";
import { Mapper } from "@common/mapper/BaseMapper";
import { CognitoAuthenticationService } from "@common/auth/cognito/CognitoAuthenticationService";

@injectable()
export class UpdateReportStatusController extends UpdateStatusController<Report, ReportPM> {
    constructor(
        @inject(ReportUseCaseLocator.UpdateStatusUseCase) updateStatus: UpdateReportStatusUseCase,
        @inject(ReportMapperLocator.ReportPresentationModelMapper) entityToPresentationModelMapper: Mapper<Report, ReportPM>,
        @inject(AuthenticatorLocator.CognitoAuthenticationService) authService: CognitoAuthenticationService
  ) {
    super(updateStatus, entityToPresentationModelMapper, authService)
  }
}