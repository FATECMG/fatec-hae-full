import 'reflect-metadata'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { type MongoServerError } from 'mongodb'
import { mock, type MockProxy } from 'jest-mock-extended'
import { SaveNoticeMongoRepository } from '@functions/notice/adapter/repositories/MongoDB/MongoRepository'
import { Notice } from '@functions/notice/entities'

jest.mock('@common/external/database/MongoDB')

describe.only('Save Notice Repository', () => {
  let mockedError: MockProxy<MongoServerError>
  let mongoServer: MongoMemoryServer
  let systemUnderTest: SaveNoticeMongoRepository
  let testNotice: Notice

  beforeAll(async () => {
    mockedError = mock()
    mockedError.code = 11000
    mockedError.keyPattern = { name: 1 }
    systemUnderTest = new SaveNoticeMongoRepository()
    mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri(), {})

    testNotice = new Notice({
      title: 'any_title',
      description: 'any_description',
      openDate: 'any_openDate',
      closeDate: 'any_closeDate',
      evaluationEndDate: 'any_evaluationEndDate',
      semester: 'any_semester',
      year: 'any_year',
      topicsOfInterest: ['any_topicOfInterest'],
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

  it('should return a notice if it is successfully saved', async () => {
    const result = await systemUnderTest.perform(testNotice)
    expect(result).toEqual(testNotice)
  })
})
