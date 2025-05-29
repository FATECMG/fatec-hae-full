import 'reflect-metadata'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Notice } from '@functions/notice/entities'
import { NoticeModel } from '@functions/notice/adapter/repositories/MongoDB/models/NoticeModel'
import { FindOneNoticeMongoRepository } from '@functions/notice/adapter/repositories/MongoDB/MongoRepository'

jest.mock('@common/external/database/MongoDB')

describe.only('FindOne Notice Repository', () => {
  let mongoServer: MongoMemoryServer
  let systemUnderTest: FindOneNoticeMongoRepository
  let testNotice: Notice
  let createTestNotice: () => Promise<string>

  beforeAll(async () => {
    systemUnderTest = new FindOneNoticeMongoRepository()
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

  it('should calls NoticeModel.findOne() with correct values', async () => {
    const findOneSpy = jest.spyOn(NoticeModel, 'findOne')
    const id = await createTestNotice()

    await systemUnderTest.perform(id)

    expect(findOneSpy).toHaveBeenCalledWith({ id })
    expect(findOneSpy).toHaveBeenCalledTimes(1)
  })

  it('should return a notice if it exists', async () => {
    const noticeId = await createTestNotice()
    const result = await systemUnderTest.perform(noticeId)
    expect(result).not.toBeUndefined()
    expect(result).toEqual(testNotice)
  })

  it('should return undefined if it not exists', async () => {
    const result = await systemUnderTest.perform('any_inexistent_id')
    expect(result).toBeUndefined()
  })
})
