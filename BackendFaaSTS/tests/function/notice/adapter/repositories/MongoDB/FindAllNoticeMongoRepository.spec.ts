import 'reflect-metadata'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Notice } from '@functions/notice/entities'
import { NoticeModel } from '@functions/notice/adapter/repositories/MongoDB/models/NoticeModel'
import { FindAllNoticeMongoRepository } from '@functions/notice/adapter/repositories/MongoDB/MongoRepository'
import { toDomain } from '@common/utils/mongo/MongoMapperUtils'

jest.mock('@common/external/database/MongoDB')
jest.mock('@common/utils/mongo/MongoMapperUtils')

describe.only('FindAll Notice Repository', () => {
  let mongoServer: MongoMemoryServer
  let systemUnderTest: FindAllNoticeMongoRepository
  let testNotice: Notice
  let createTestNotice: () => Promise<string>

  beforeAll(async () => {
    systemUnderTest = new FindAllNoticeMongoRepository()
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

  it('should calls NoticeModel.find() with correct values', async () => {
    const findSpy = jest.spyOn(NoticeModel, 'find')

    await systemUnderTest.perform(true)

    expect(findSpy).toHaveBeenCalledWith({ active: true })
    expect(findSpy).toHaveBeenCalledTimes(1)
  })

  it('should return empty array if NoticeModel.find() returns empty array', async () => {
    const result = await systemUnderTest.perform(true)
    expect(result).toEqual([])
  })

  it('should return all Notices', async () => {
    jest.mocked(toDomain).mockReturnValueOnce(testNotice)
    await createTestNotice()
    const result = await systemUnderTest.perform(true)
    expect(result).toEqual([testNotice])
  })
})
