import mongoose from 'mongoose'

let connection: typeof mongoose
const uri: string = process.env.MONGO_URI || ''
const dbName: string = process.env.MONGO_DB_NAME || ''

/**
 *
 * @async  Returns the connection when it is established with the database.
 * @function Function that connects to the MongoDB database.
 * @returns Returns a promise with the connection to the database.
 */
export const connectDatabase = async function (): Promise<typeof mongoose> {
  if (connection == null) {
    console.log('Creating new connection to the Database!')
    connection = await mongoose
      .connect(uri, {
        dbName,
        serverSelectionTimeoutMS: 3000
      })
    return connection
  }
  console.log('Connection already established, reusing the existing connection')
  return connection
}
