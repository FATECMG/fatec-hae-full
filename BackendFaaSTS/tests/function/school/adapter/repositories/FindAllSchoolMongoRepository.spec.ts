import 'reflect-metadata'
import mongoose from 'mongoose'

import { MongoMemoryServer } from 'mongodb-memory-server'

import { SchoolModel } from '@functions/school/adapter/repositories/MongoDB/models/SchoolModel'
import { School } from '@functions/school/entities/School'
import { FindAllSchoolMongoRepository } from '@functions/school/adapter/repositories/MongoDB/FindAll'

jest.mock('@common/external/database/MongoDB')

describe.only('FindAllSchoolMongoRepository', () => {
  let mongoServer: MongoMemoryServer
  let systemUnderTest: FindAllSchoolMongoRepository
  let testSchool: School
  let createTestSchool: () => Promise<string>

  beforeAll(async () => {
    systemUnderTest = new FindAllSchoolMongoRepository()
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

  it('should return an array of schools on success', async () => {
    await createTestSchool()

    const result = await systemUnderTest.perform(true)

    expect(result).not.toBeUndefined()
    expect(result.length).toBe(1)
  })

  it('should return an empty array if no schools is found', async () => {
    const result = await systemUnderTest.perform(true)

    expect(result).not.toBeUndefined()
    expect(result.length).toBe(0)
  })
})
