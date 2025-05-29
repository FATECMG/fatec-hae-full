import { type DeleteUseCase, type DeleteResult } from '@common/domain/UseCase.interface'
import { type DeleteEntityRepository } from '@common/repository/RepositoryInterface'

import { CourseLocator } from '@functions/course/shared/Di.enums'

import { inject, injectable } from 'inversify'

@injectable()
export class DeleteCourseUseCase implements DeleteUseCase {
  constructor (@inject(CourseLocator.CourseDeleteRepository) private readonly courseRepository: DeleteEntityRepository) {}

  async execute (id: string): Promise<DeleteResult> {
    const result = await this.courseRepository.perform(id)
    let message = 'Excluído com sucesso'
    if (!result) message = 'Não foi possível excluir, tente novamente mais tarde!'
    return { deleted: result, message }
  }
}
