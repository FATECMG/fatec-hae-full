import 'reflect-metadata'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { type MongoServerError } from 'mongodb'
import { mock, type MockProxy } from 'jest-mock-extended'
import { Notice } from '@functions/notice/entities'
import { NoticeModel } from '@functions/notice/adapter/repositories/MongoDB/models/NoticeModel'
import { DeleteNoticeMongoRepository } from '@functions/notice/adapter/repositories/MongoDB/MongoRepository'

jest.mock('@common/external/database/MongoDB')

describe.only('Delete Notice Repository', () => {
  let mockedError: MockProxy<MongoServerError>
  let mongoServer: MongoMemoryServer
  let systemUnderTest: DeleteNoticeMongoRepository
  let testNotice: Notice
  let createTestNotice: () => Promise<string>

  beforeAll(async () => {
    mockedError = mock()
    mockedError.code = 11000
    mockedError.keyPattern = { name: 1 }
    systemUnderTest = new DeleteNoticeMongoRepository()
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
      topicsOfInterest: ['any_topicOfInterest']
    })

    createTestNotice = async (): Promise<string> => {
      const result = await NoticeModel.create(testNotice)
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

  it('should calls NoticeModel.findOneAndDelete() with correct values', async () => {
    const findOneAndDeleteSpy = jest.spyOn(NoticeModel, 'findOneAndDelete')
    const id = await createTestNotice()
    await systemUnderTest.perform(id)

    expect(findOneAndDeleteSpy).toHaveBeenCalledWith({ id })
  })

  it('should return true if NoticeModel.findOneAndDelete() returns a deleted Notice', async () => {
    const id = await createTestNotice()
    const result = await systemUnderTest.perform(id)

    expect(result).toBe(true)
  })

  it('should return false if NoticeModel.findOneAndDelete() returns null', async () => {
    const id = 'any_id'
    const result = await systemUnderTest.perform(id)

    expect(result).toBe(false)
  })
})
