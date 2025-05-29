import axios from 'axios'
import * as functions from 'firebase-functions'
import { differenceInHours } from 'date-fns'
import { Schema, model, Document } from 'mongoose'
import Entity from '../../entities/Entity'
import { warmConnections } from '../../../index'

export interface AuthorizationToken extends Entity, Document {
  token?: string
  createdAt: Date
  updatedAt: Date
}

const AuthorizationTokenSchema = new Schema(
  {
    token: { type: String },
  },
  { timestamps: true },
)

const AuthorizationTokenCollection = model<AuthorizationToken>(
  'authorizationtokens',
  AuthorizationTokenSchema,
)

export function isExpired(updatedAt: Date): boolean {
  const now = new Date()
  const diff = differenceInHours(now, updatedAt)
  return diff > 0
}
export async function requestNewTokenFromGateway(): Promise<{
  access_token: string
}> {
  const username = functions.config().payment.id
  const password = functions.config().payment.token
  const authorizationServerURL = functions.config().juno
    .authorization_server_url
  try {
    const { data } = await axios({
      url: `${authorizationServerURL}/oauth/token`,
      method: 'post',
      params: {
        grant_type: 'client_credentials',
      },
      auth: {
        username,
        password,
      },
    })
    return data
  } catch ({ response }) {
    return { access_token: '' }
  }
}
export const getAuthorizationToken = async (): Promise<string> => {
  await warmConnections()
  const allTokens = await AuthorizationTokenCollection.find()
  const [tokenModel] = allTokens
  if (isExpired(tokenModel.updatedAt)) {
    const authToken = await requestNewTokenFromGateway()
    if (authToken) {
      tokenModel.token = authToken.access_token
      await tokenModel.save()
    }
    return authToken.access_token
  }
  return tokenModel.token
}
