import { handlerPath } from '@libs/HandlerResolver'

const getAddress = {
  handler: `${handlerPath(__dirname)}/Handler.getAddress`,
  events: [
    {
      http: {
        method: 'get',
        path: '/address/{id}',
        cors: true
      }
    }
  ]
}

export default {
  getAddress
} as const
