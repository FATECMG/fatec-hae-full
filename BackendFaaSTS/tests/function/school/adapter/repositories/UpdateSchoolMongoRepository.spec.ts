import 'reflect-metadata'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { type MongoServerError } from 'mongodb'
import { mock, type MockProxy } from 'jest-mock-extended'

import { School } from '@functions/school/entities/School'
import { toDomain } from '@functions/school/adapter/repositories/MongoDB/utils'
import { UpdateSchoolMongoRepository } from '@functions/school/adapter/repositories/MongoDB/Update'
import { SchoolModel } from '@functions/school/adapter/repositories/MongoDB/models/SchoolModel'

jest.mock('@common/external/database/MongoDB')

describe.only('UpdateSchoolMongoRepository', () => {
  let mockedError: MockProxy<MongoServerError>
  let mongoServer: MongoMemoryServer
  let systemUnderTest: UpdateSchoolMongoRepository
  let testSchool: School
  let createTestSchool: (school: School) => Promise<School>

  beforeAll(async () => {
    mockedError = mock()
    mockedError.code = 11000
    mockedError.keyPattern = { name: 1 }
    systemUnderTest = new UpdateSchoolMongoRepository()
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

    createTestSchool = async (school: School): Promise<School> => {
      const result = await SchoolModel.create(school)
      return toDomain(result)
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

  it('should update school on success', async () => {
    const school = await createTestSchool(testSchool)
    school.name = 'any_updated_name'

    const result = await systemUnderTest.perform(school, school.id)

    expect(result).toEqual({ ...testSchool, name: 'any_updated_name' })
  })

  it('should return undefined if no school was found to be updated', async () => {
    const school = await createTestSchool(testSchool)
    school.name = 'any_updated_name'

    const result = await systemUnderTest.perform(school, 'any_invalid_id')

    expect(result).toBeUndefined()
  })

  /* it('should throw DuplicatedFieldError if duplicated name is sent to be updated', async () => {
    const school = await createTestSchool(testSchool)
    const newSchool = new School({ ...school, name: 'any_other_name' })
    const otherSchool = await createTestSchool(newSchool)

    const result = await systemUnderTest.perform(school, otherSchool.id)
    console.log(result)
    await expect(result).resolves.toThrow(new DuplicatedFieldError({
      mongoError: mockedError,
      errorLabel,
      entity: school,
      possibleDuplicatedFields: 'name'
    }))
  }) */
})
