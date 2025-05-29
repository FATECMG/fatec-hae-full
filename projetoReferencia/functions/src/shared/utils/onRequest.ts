import * as functions from 'firebase-functions'
type Handler = (req: any, res: any) => void | Promise<void>
interface Config {
  region?: string
  handler: Handler
}
type IOnRequest = (config: Config) => functions.HttpsFunction
export const onRequest: IOnRequest = ({
  region = 'southamerica-east1',
  handler,
}) => {
  return functions.region(region).https.onRequest(handler)
}
