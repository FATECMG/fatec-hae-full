import 'reflect-metadata'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { type MongoServerError } from 'mongodb'
import { mock, type MockProxy } from 'jest-mock-extended'

import { SchoolModel } from '@functions/school/adapter/repositories/MongoDB/models/SchoolModel'
import { School } from '@functions/school/entities/School'
import { SaveSchoolMongoRepository } from '@functions/school/adapter/repositories/MongoDB/Save'
import { isMongoDuplicationError, getPropertyNameFromError, getPropertyTranslation } from '@common/utils/mongo/MongoErrorUtils'

jest.mock('@common/external/database/MongoDB')
jest.mock('@common/utils/mongo/MongoErrorUtils')
jest.mock('@functions/school/adapter/repositories/MongoDB/models/SchoolModel')

describe('SaveSchoolMongoRepository', () => {
  let mockedError: MockProxy<MongoServerError>
  let mongoServer: MongoMemoryServer
  let systemUnderTest: SaveSchoolMongoRepository
  let testSchool: School

  beforeAll(async () => {
    mockedError = mock()
    mockedError.code = 11000
    mockedError.keyPattern = { name: 1 }
    systemUnderTest = new SaveSchoolMongoRepository()
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

  it('should create SchoolModel object with correct params', async () => {
    const spy = jest.spyOn(SchoolModel.prototype, 'constructor').mockImplementationOnce(() => {})

    await systemUnderTest.perform(testSchool)

    expect(spy).toHaveBeenCalledWith(testSchool)
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('should return a school if it is successfully saved', async () => {
    const result = await systemUnderTest.perform(testSchool)

    expect(result).toEqual(testSchool)
  })

  it('should throw DuplicatedFieldError if duplicated name is sent to be saved', async () => {
    mockedError.keyPattern = { name: 1 }
    const school = await systemUnderTest.perform(testSchool)
    jest.spyOn(SchoolModel.prototype, 'save').mockRejectedValueOnce(mockedError)
    jest.mocked(isMongoDuplicationError).mockReturnValueOnce(true)
    jest.mocked(getPropertyNameFromError).mockReturnValueOnce('name')
    jest.mocked(getPropertyTranslation).mockReturnValueOnce('Nome de escola')
    const result = systemUnderTest.perform({ ...school, id: 'other_id' })

    await expect(result).rejects.toThrow('Nome de escola any_name já existe!')
  })
})
