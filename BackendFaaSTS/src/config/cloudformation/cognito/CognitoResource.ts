import UserPoolDomain  from '@config/cloudformation/cognito/UserPoolDomain'
import UserPoolClient from '@config/cloudformation/cognito/UserPoolClient'
import UserPool from '@config/cloudformation/cognito/UserPool'


export default {
    ...UserPoolDomain,
    ...UserPoolClient,
    ...UserPool
} as const