import { IExternal } from '../../../../shared/adapters/external/interfaces.external'
import { getPubSub } from '../../../../shared/utils/pubsub'
import { injectable } from 'inversify'
import { IContract } from '../../../contracts/entities/interfaces'

@injectable()
export class CreateContractExternal implements IExternal<IContract, void> {
  async call(contract: IContract): Promise<void> {
    const pubsub = getPubSub()
    await pubsub.topic('create-contract').publishJSON({ contract })
  }
}
