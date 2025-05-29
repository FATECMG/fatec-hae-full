import 'reflect-metadata'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { type MongoServerError } from 'mongodb'
import { mock, type MockProxy } from 'jest-mock-extended'

import { SchoolModel } from '@functions/school/adapter/repositories/MongoDB/models/SchoolModel'
import { School } from '@functions/school/entities/School'
import { FindOneSchoolMongoRepository } from '@functions/school/adapter/repositories/MongoDB/FindOne'

jest.mock('@common/external/database/MongoDB')

describe.only('FindOneSchoolMongoRepository', () => {
  let mockedError: MockProxy<MongoServerError>
  let mongoServer: MongoMemoryServer
  let systemUnderTest: FindOneSchoolMongoRepository
  let testSchool: School
  let createTestSchool: () => Promise<string>

  beforeAll(async () => {
    mockedError = mock()
    mockedError.code = 11000
    mockedError.keyPattern = { name: 1 }
    systemUnderTest = new FindOneSchoolMongoRepository()
    mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri(), {})

    testSchool = new School({
      name: 'any_name',
      address: {
        city: 'any_city',
        complement: 'any_complement',
        district: 'any_district',
        number: 'any_number',
        postCode: 'any_postCode',
        state: 'any_state',
        street: 'any_street'
      },
      active: true
    })

    createTestSchool = async (): Promise<string> => {
      const result = await SchoolModel.create(testSchool)
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

  it('should calls SchoolModel.findOne() with correct values', async () => {
    const findOneSpy = jest.spyOn(SchoolModel, 'findOne')
    const id = await createTestSchool()

    await systemUnderTest.perform(id)

    expect(findOneSpy).toHaveBeenCalledWith({ id })
    expect(findOneSpy).toHaveBeenCalledTimes(1)
  })

  it('should returns undefined if SchoolModel.findOne() returns null', async () => {
    await createTestSchool()

    const result = await systemUnderTest.perform('any_non_existent_id')

    expect(result).toBeUndefined()
  })

  it('should returns a School if SchoolModel.findOne() returns a School', async () => {
    const id = await createTestSchool()

    const result = await systemUnderTest.perform(id)

    expect(result).toEqual(testSchool)
  })
})
