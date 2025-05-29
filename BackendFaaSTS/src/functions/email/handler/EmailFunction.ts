import { handlerPath } from '@libs/HandlerResolver'

const send = {
  handler: `${handlerPath(__dirname)}/EmailHandler.send`,
  events: [
    {
      http: {
        method: 'post',
        path: '/email',
        cors: true
      }
    }
  ]
}

export default {
  send
} as const
