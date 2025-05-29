import 'reflect-metadata'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

import { User } from '@functions/user/entities/User'
import { UserModel } from '@functions/user/adapter/repositories/MongoDB/models/UserModel'
import { FindOneUserMongoRepository } from '@functions/user/adapter/repositories/MongoDB/FindOne'
import { toDomain } from '@functions/user/adapter/repositories/MongoDB/utils/toDomain'

jest.mock('@common/external/database/MongoDB')
jest.mock('@functions/user/adapter/repositories/MongoDB/utils/toDomain')

describe('FindOneUserMongoRepository', () => {
  let mongoServer: MongoMemoryServer
  let systemUnderTest: FindOneUserMongoRepository
  let testUser: User
  let createTestUser: () => Promise<string>

  beforeAll(async () => {
    systemUnderTest = new FindOneUserMongoRepository()
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

  it('should calls UserModel.findOne() with correct values', async () => {
    const findOneSpy = jest.spyOn(UserModel, 'findOne')
    const id = await createTestUser()

    await systemUnderTest.perform(id)

    expect(findOneSpy).toHaveBeenCalledWith({ id })
    expect(findOneSpy).toHaveBeenCalledTimes(1)
  })

  it('should returns undefined if no user was found', async () => {
    await createTestUser()

    const result = await systemUnderTest.perform('any_unexistent_id')

    expect(result).toBeUndefined()
  })

  it('should returns a user if one was found', async () => {
    jest.mocked(toDomain).mockReturnValueOnce(testUser)
    const id = await createTestUser()

    const result = await systemUnderTest.perform(id)

    expect(result).toEqual(testUser)
  })
})
