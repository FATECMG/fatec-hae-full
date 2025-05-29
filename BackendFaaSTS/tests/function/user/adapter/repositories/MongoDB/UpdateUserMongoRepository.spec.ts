import 'reflect-metadata'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { type MockProxy, mock } from 'jest-mock-extended'
import { type MongoServerError } from 'mongodb'

import { DuplicatedFieldError } from '@common/error/DuplicatedFieldError'
import { User } from '@functions/user/entities/User'
import { UserModel } from '@functions/user/adapter/repositories/MongoDB/models/UserModel'
import { UpdateUserMongoRepository } from '@functions/user/adapter/repositories/MongoDB/Update'
import {
  errorLabel,
  toDomain
} from '@functions/user/adapter/repositories/MongoDB/utils'
import { RoleModel } from '@functions/role/adapter/repositories/model/RoleMongoModel'
import { EntityNotFoundByNameError } from '@common/error/NotFoundError'

jest.mock('@common/external/database/MongoDB')
jest.mock('@functions/user/adapter/repositories/MongoDB/utils/toDomain')

describe('UpdateUserMongoRepository', () => {
  let mockedError: MockProxy<MongoServerError>
  let mongoServer: MongoMemoryServer
  let systemUnderTest: UpdateUserMongoRepository
  let testUser: User
  let createTestUser: () => Promise<string>

  beforeAll(async () => {
    mockedError = mock()
    mockedError.code = 11000
    systemUnderTest = new UpdateUserMongoRepository()
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

    await RoleModel.create({
      id: 'any_id',
      name: 'any_role',
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

  it('should update a user', async () => {
    jest.mocked(toDomain).mockReturnValueOnce({
      ...testUser,
      email: 'updated_email'
    })
    const id = await createTestUser()

    const result = await systemUnderTest.perform(
      { ...testUser, email: 'updated_email' },
      id
    )

    expect(result).toEqual({ ...testUser, email: 'updated_email' })
  })

  it('should return undefined if user is not found to be updated', async () => {
    const result = await systemUnderTest.perform(testUser, 'any_id')

    expect(result).toBeUndefined()
  })

  it('should throw a DuplicatedFieldError if duplicated email is sent to be update', async () => {
    mockedError.keyPattern = { email: 1 }

    const id = await createTestUser()

    const other = await new UserModel({
      ...testUser,
      email: 'other_email',
      registerNumber: 'other_registerNumber',
      id: 'other_id'
    }).save({ safe: true })

    const result = systemUnderTest.perform(
      { ...testUser, email: 'other_email' },
      id
    )

    await expect(result).rejects.toThrow(
      new DuplicatedFieldError({
        entity: other,
        errorLabel,
        mongoError: mockedError,
        possibleDuplicatedFields: 'email'
      })
    )
  })

  it('should throw a DuplicatedFieldError if duplicated registerNumber is sent to be update', async () => {
    mockedError.keyPattern = { registerNumber: 1 }
    const id = await createTestUser()
    const other = await new UserModel({
      ...testUser,
      email: 'other_email',
      registerNumber: 'other_registerNumber',
      id: 'other_id'
    }).save({ safe: true })

    const result = systemUnderTest.perform(
      { ...testUser, registerNumber: 'other_registerNumber' },
      id
    )

    await expect(result).rejects.toThrow(
      new DuplicatedFieldError({
        entity: other,
        errorLabel,
        mongoError: mockedError,
        possibleDuplicatedFields: 'registerNumber'
      })
    )
  })

  it('should throw a EntityNotFoundByNameError if ROLE is not found', async () => {
    const id = await createTestUser()
    const result = systemUnderTest.perform(
      { ...testUser, roles: 'other_role' },
      id
    )

    await expect(result).rejects.toThrow(
      new EntityNotFoundByNameError('other_role', 'Cargo')
    )
  })
})
