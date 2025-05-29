/* eslint-disable @typescript-eslint/no-explicit-any */
import { connection, connect, STATES } from 'mongoose'
import { DATABASE } from '../config/params'
import * as functions from 'firebase-functions'

const { db = {} } = functions.config()
export const connectDatabase = async () => {
  const { user, pass } = db
  if (!connection || STATES[connection.readyState] === 'disconnected') {
    await connect(DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
      user,
      pass,
      dbName: 'zelpay',
      promiseLibrary: Promise,
    })
    functions.logger.log('Creating a new connection.')
    return
  }
  functions.logger.log('Using an existing connection')
}
