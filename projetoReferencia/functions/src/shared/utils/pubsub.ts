import { PubSub } from '@google-cloud/pubsub'

let client: PubSub
export function getPubSub(): PubSub {
  if (!client) {
    client = new PubSub()
  }
  return client
}
