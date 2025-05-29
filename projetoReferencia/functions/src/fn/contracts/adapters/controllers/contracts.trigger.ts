import { Message } from 'firebase-functions/lib/providers/pubsub'
import { IPubSubTrigger } from '../../../../shared/adapters/controllers/interfaces'
import { container } from '../../shared/di.container'
import { Locator } from '../../shared/di.enums'

const createContractTrigger = container.get<IPubSubTrigger>(
  Locator.CreateContractTrigger,
)

const endTrialTrigger = container.get<IPubSubTrigger>(Locator.EndTrialTrigger)
const deactivateContractTrigger = container.get<IPubSubTrigger>(
  Locator.DeactivateContractTrigger,
)
const manageContractsJob = container.get<IPubSubTrigger>(
  Locator.ManageContractsJob,
)

export const create = async (message: any, context: any) => {
  try {
    await createContractTrigger.handle(message, context)
  } catch (err) {
    console.log(err)
  }
  return
}

export const endTrial = async (message: Message) => {
  try {
    await endTrialTrigger.handle(message, undefined)
  } catch (err) {
    console.error(err)
  }
}

export const deactivateContract = async (message: Message) => {
  try {
    await deactivateContractTrigger.handle(message, undefined)
  } catch (err) {
    console.error(err)
  }
}

export const manageContracts = async () => {
  try {
    await manageContractsJob.handle(undefined, undefined)
  } catch (err) {
    console.error(err)
  }
}
