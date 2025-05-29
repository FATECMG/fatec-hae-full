import { type HttpResponse } from '@common/http/Types'
import { ok } from '@common/http/Helpers'
import { Mapper } from '@common/mapper/BaseMapper'
import { FindAllFromEntityUseCase } from '@common/domain/UseCase.interface'

import { injectable } from 'inversify'

@injectable()
export default abstract class FindAllFromEntityController<E, P> {
  constructor (
    private readonly entityToPresentationModelMapper: Mapper<E, P>,
    private readonly findAll: FindAllFromEntityUseCase<E>
  ) {}

  async handle (id: string): Promise<HttpResponse<P[]>> {
    const objects = await this.findAll.execute(id)
    const presentation = []
    for (const resource of objects) {
      presentation.push(await this.entityToPresentationModelMapper.execute(resource))
    }
    return ok(presentation)
  }
}
