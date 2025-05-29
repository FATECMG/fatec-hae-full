import 'reflect-metadata'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { type MockProxy, mock } from 'jest-mock-extended'
import { type MongoServerError } from 'mongodb'

import { DuplicatedFieldError } from '@common/error/DuplicatedFieldError'
import { SaveUserMongoRepository } from '@functions/user/adapter/repositories/MongoDB/Save'
import { User } from '@functions/user/entities/User'
import { errorLabel } from '@functions/user/adapter/repositories/MongoDB/utils'
import { RoleModel } from '@functions/role/adapter/repositories/model/RoleMongoModel'

jest.mock('@common/external/database/MongoDB')

describe('SaveUserMongoRepository', () => {
  let mockedError: MockProxy<MongoServerError>
  let mongoServer: MongoMemoryServer
  let systemUnderTest: SaveUserMongoRepository
  let testUser: User

  beforeAll(async () => {
    mockedError = mock()
    mockedError.code = 11000
    systemUnderTest = new SaveUserMongoRepository()
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
    await RoleModel.create({ id: 'any_id', name: 'any_role', active: true })
  })

  afterEach(async () => {
    const collections = mongoose.connection.collections
    for (const key in collections) {
      if (key === 'roles') continue
      const collection = collections[key]
      await collection.deleteMany()
    }
  })

  afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    await mongoServer.stop()
  })

  it('should save a user', async () => {
    const user = await systemUnderTest.perform(testUser)

    expect(user).toEqual(testUser)
  })

  it('should throw a DuplicatedFieldError if duplicated registerNumber is sent', async () => {
    mockedError.keyPattern = { registerNumber: 1 }
    const otherUser = new User({ ...testUser, email: 'other_email' })
    await systemUnderTest.perform(testUser)

    const result = systemUnderTest.perform(otherUser)

    await expect(result).rejects.toThrow(new DuplicatedFieldError({
      entity: otherUser,
      errorLabel,
      mongoError: mockedError,
      possibleDuplicatedFields: 'registerNumber'
    }))
  })

  it('should throw a DuplicatedFieldError if duplicated email is sent', async () => {
    mockedError.keyPattern = { email: 1 }
    const otherUser = new User({ ...testUser, registerNumber: 'other_registerNumber' })
    await systemUnderTest.perform(testUser)

    const result = systemUnderTest.perform(otherUser)
    await expect(result).rejects.toThrow(new DuplicatedFieldError({
      entity: otherUser,
      errorLabel,
      mongoError: mockedError,
      possibleDuplicatedFields: 'email'
    }))
  })
})
