import { handlerPath } from '@libs/HandlerResolver'

const postPasswordValidator = {
  handler: `${handlerPath(__dirname)}/handlers/PasswordValidation.postPasswordValidator`,
  events: [
    {
      http: {
        method: 'post',
        path: '/passwordvalidation',
        cors: true
      }
    }
  ]
}

const getPolicies = {
  handler: `${handlerPath(__dirname)}/handlers/GetPolicies.getPolicies`,
  events: [
    {
      http: {
        method: 'get',
        path: '/passwordvalidation/policies',
        cors: true
      }
    }
  ]
}

export default {
  postPasswordValidator,
  getPolicies
}
