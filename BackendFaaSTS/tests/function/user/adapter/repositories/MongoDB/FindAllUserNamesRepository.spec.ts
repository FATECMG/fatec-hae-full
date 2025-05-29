import 'reflect-metadata'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

import { User } from '@functions/user/entities/User'
import { toDomain } from '@functions/user/adapter/repositories/MongoDB/utils'
import { UserModel } from '@functions/user/adapter/repositories/MongoDB/models/UserModel'
import { FindAllUserNamesAndIdMongoRepository } from '@functions/user/adapter/repositories/MongoDB/FindAllNamesAndId'

jest.mock('@common/external/database/MongoDB')
jest.mock('@functions/user/adapter/repositories/MongoDB/utils/toDomain')

describe('FindAllUserMongoRepository', () => {
  let mongoServer: MongoMemoryServer
  let systemUnderTest: FindAllUserNamesAndIdMongoRepository
  let testUser: User
  let createTestUser: () => Promise<string>

  beforeAll(async () => {
    systemUnderTest = new FindAllUserNamesAndIdMongoRepository()
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

  it('should calls UserModel.find() with correct values', async () => {
    const findSpy = jest.spyOn(UserModel, 'find')

    await systemUnderTest.perform(true)

    expect(findSpy).toHaveBeenCalledWith({ active: true }, { name: 1, id: 1, _id: 0 })
    expect(findSpy).toHaveBeenCalledTimes(1)
  })

  it('should return empty array if UserModel.find() returns empty array', async () => {
    const result = await systemUnderTest.perform(true)

    expect(result).toEqual([])
  })

  it('should return all users NAMES', async () => {
    jest.mocked(toDomain).mockReturnValueOnce(testUser)
    await createTestUser()

    const result = await systemUnderTest.perform(true)

    expect(result).toEqual([{ id: testUser.id, name: testUser.name }])
  })
})
