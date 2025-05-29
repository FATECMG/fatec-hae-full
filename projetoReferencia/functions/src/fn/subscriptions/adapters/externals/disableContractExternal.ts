import { injectable } from 'inversify'
import { IExternal } from '../../../../shared/adapters/external/interfaces.external'
import { getPubSub } from '../../../../shared/utils/pubsub'

@injectable()
export class DisableContractExternal implements IExternal<string, void> {
  async call(contractId: string): Promise<void> {
    const pub = getPubSub()

    await pub
      .topic('deactivate-contract')
      .publishJSON({ contract: { _id: contractId } })
  }
}
