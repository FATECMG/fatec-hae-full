import 'reflect-metadata'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

import { User } from '@functions/user/entities/User'
import { UserModel } from '@functions/user/adapter/repositories/MongoDB/models/UserModel'
import { DeleteUserMongoRepository } from '@functions/user/adapter/repositories/MongoDB/Delete'

jest.mock('@common/external/database/MongoDB')

describe('DeleteUserMongoRepository', () => {
  let mongoServer: MongoMemoryServer
  let systemUnderTest: DeleteUserMongoRepository
  let testUser: User
  let createTestUser: () => Promise<string>

  beforeAll(async () => {
    systemUnderTest = new DeleteUserMongoRepository()
    mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri(), {})

    testUser = new User({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
      roles: 'any_role',
      courses: [
        {
          id: 'any_id',
          name: 'any_name'
        }
      ],
      academicTitle: 'GRADUADO',
      phone: 'any_phone',
      registerNumber: 'any_registerNumber',
      active: true
    })

    createTestUser = async (): Promise<string> => {
      const result = await UserModel.create(testUser)
      return result.id
    }
  })

  afterEach(async () => {
    const collections = mongoose.connection.collections

    for (const key in collections) {
      const collection = collections[key]
      await collection.deleteMany()
    }
  })

  afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    await mongoServer.stop()
  })

  it('should calls UserModel.findOneAndDelete() with correct values', async () => {
    const findOneAndDeleteSpy = jest.spyOn(UserModel, 'findOneAndDelete')
    const id = await createTestUser()

    await systemUnderTest.perform(id)

    expect(findOneAndDeleteSpy).toHaveBeenCalledWith({ id })
  })

  it('should return true if UserModel.findOneAndDelete() returns a deleted user', async () => {
    const id = await createTestUser()

    const result = await systemUnderTest.perform(id)

    expect(result).toBe(true)
  })

  it('should return false if UserModel.findOneAndDelete() returns null', async () => {
    const id = 'any_id'

    const result = await systemUnderTest.perform(id)

    expect(result).toBe(false)
  })
})
