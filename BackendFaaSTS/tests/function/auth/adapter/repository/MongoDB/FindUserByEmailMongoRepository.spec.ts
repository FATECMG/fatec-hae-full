import 'reflect-metadata'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

import { User } from '@functions/user/entities/User'
import { UserModel } from '@functions/user/adapter/repositories/MongoDB/models/UserModel'
import { toDomain } from '@functions/user/adapter/repositories/MongoDB/utils'
import { FindUserByEmailMongoRepository } from '@functions/auth/adapter/repository/MongoDB/AuthRepository'

jest.mock('@common/external/database/MongoDB')
jest.mock('@functions/user/adapter/repositories/MongoDB/utils/toDomain')

describe('FindUserByEmailMongoRepository', () => {
  let mongoServer: MongoMemoryServer
  let systemUnderTest: FindUserByEmailMongoRepository
  let testUser: User
  let createTestUser: () => Promise<void>

  beforeAll(async () => {
    systemUnderTest = new FindUserByEmailMongoRepository()
    mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri(), {})

    testUser = new User({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
      roles: 'any_role',
      academicTitle: 'GRADUADO',
      courses: [
        {
          id: 'any_id',
          name: 'any_name'
        }
      ],
      phone: 'any_phone',
      registerNumber: 'any_registerNumber',
      active: true
    })

    createTestUser = async (): Promise<void> => {
      await UserModel.create(testUser)
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
    await createTestUser()

    await systemUnderTest.perform(testUser.email)

    expect(findOneSpy).toHaveBeenCalledWith({ email: testUser.email })
  })

  it('should return undefined if UserModel.findOne() returns null', async () => {
    await createTestUser()

    const result = await systemUnderTest.perform('invalid_email')

    expect(result).toBeUndefined()
  })

  it('should return an User if UserModel.findOne() returns a valid user', async () => {
    jest.mocked(toDomain).mockReturnValueOnce(testUser)
    await createTestUser()

    const result = await systemUnderTest.perform(testUser.email)

    expect(result).toEqual(testUser)
  })
})
