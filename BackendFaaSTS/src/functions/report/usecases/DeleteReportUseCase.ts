import { type DeleteUseCase, type DeleteResult } from '@common/domain/UseCase.interface'
import { DeleteEntityRepository, FindOneEntityRepository } from '@common/repository/RepositoryInterface';
import { inject, injectable } from "inversify";
import { ReportRepositoryLocator } from '../shared/Di.enums';
import { Report } from '../entities/Report';
import { GeneratePreSignedURL } from '@common/s3url/GeneratePreSignedURL';

@injectable()
export class DeleteReportUseCase implements DeleteUseCase {

    constructor (
        @inject(ReportRepositoryLocator.DeleteReportRepository) private readonly deleteReportRepository: DeleteEntityRepository,
        @inject(ReportRepositoryLocator.FindOneReportByIdRepository) private readonly reportRepository: FindOneEntityRepository<Report>
    ) {}
    
    async execute (id: string): Promise<DeleteResult> {

        const report = await this.reportRepository.perform(id)

        const s3 = new GeneratePreSignedURL()

        const prefix = `reports/${report!.project.id}/`;

        await s3.deleteObjectsByPrefix(prefix);


        const result = await this.deleteReportRepository.perform(id)
        let message = 'Excluído com sucesso'
        if (!result) message = 'Não foi possível excluir, tente novamente mais tarde!'
        return { deleted: result, message }
    }
}