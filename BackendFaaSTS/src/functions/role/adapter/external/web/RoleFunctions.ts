import { handlerPath } from '@libs/HandlerResolver'

const getRoles = {
  handler: `${handlerPath(__dirname)}/Handler.getRoles`,
  events: [
    {
      http: {
        method: 'get',
        path: '/roles',
        cors: true
      }
    }
  ]
}

export default { getRoles } as const
