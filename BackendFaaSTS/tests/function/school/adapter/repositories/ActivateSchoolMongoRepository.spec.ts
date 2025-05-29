import 'reflect-metadata'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

import { SchoolModel } from '@functions/school/adapter/repositories/MongoDB/models/SchoolModel'
import { School } from '@functions/school/entities/School'
import { ActivateSchoolMongoRepository } from '@functions/school/adapter/repositories/MongoDB/Activate'

jest.mock('@common/external/database/MongoDB')

describe.only('ActivateSchoolMongoRepository', () => {
  let mongoServer: MongoMemoryServer
  let systemUnderTest: ActivateSchoolMongoRepository
  let testSchool: School
  let createTestSchool: () => Promise<string>

  beforeAll(async () => {
    systemUnderTest = new ActivateSchoolMongoRepository()
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

  it('should calls SchoolModel.findOneAndUpdate() with correct values', async () => {
    const findOneAndUpdateSpy = jest.spyOn(SchoolModel, 'findOneAndUpdate')
    const id = await createTestSchool()

    await systemUnderTest.perform(id)

    expect(findOneAndUpdateSpy).toHaveBeenCalledWith({ id }, { active: true }, { new: true })
  })

  it('should return true if SchoolModel.findOneAndUpdate() returns a activated school', async () => {
    const id = await createTestSchool()

    const result = await systemUnderTest.perform(id)

    expect(result).toBe(true)
  })

  it('should return false if SchoolModel.findOneAndUpdate() returns null', async () => {
    const id = 'any_id'

    const result = await systemUnderTest.perform(id)

    expect(result).toBe(false)
  })
})
