import * as functions from 'firebase-functions'
import { Message } from 'firebase-functions/lib/providers/pubsub'
import { IPubSubHandle } from '../adapters/controllers/interfaces'
interface Config {
  region?: string
  retry?: boolean
  topic: string
  handler: IPubSubHandle
}
type IOnPublish = (config: Config) => functions.CloudFunction<Message>
export const onPublish: IOnPublish = ({
  region = 'southamerica-east1',
  topic,
  handler,
  retry,
}) => {
  return functions
    .region(region)
    .runWith({ failurePolicy: !!retry })
    .pubsub.topic(topic)
    .onPublish(handler)
}
