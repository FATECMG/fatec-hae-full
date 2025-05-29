import 'reflect-metadata'
import { Notice } from '@functions/notice/entities'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { NoticeModel } from '@functions/notice/adapter/repositories/MongoDB/models/NoticeModel'
import { FindTopicsByNoticeIdMongoRepository } from '@functions/notice/adapter/repositories/MongoDB/MongoRepository'

jest.mock('@common/external/database/MongoDB')

describe.only('Find Topics Notice Repository', () => {
  let mongoServer: MongoMemoryServer
  let systemUnderTest: FindTopicsByNoticeIdMongoRepository
  let testNotice: Notice
  let createTestNotice: () => Promise<string>

  beforeAll(async () => {
    systemUnderTest = new FindTopicsByNoticeIdMongoRepository()
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
      topicsOfInterest: ['any_topicOfInterest', 'any_topicOfInterest2']
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

    expect(findOneSpy).toHaveBeenCalledWith({ active: true, id }, { topicsOfInterest: 1 })

    expect(findOneSpy).toHaveBeenCalledTimes(1)
  })

  it('should return an array of topics', async () => {
    const id = await createTestNotice()

    const topics = await systemUnderTest.perform(id)

    expect(topics?.topicsOfInterest).toEqual(['any_topicOfInterest', 'any_topicOfInterest2'])
  })

  it('should return undefined if notice not found', async () => {
    const id = 'any_id'

    const topics = await systemUnderTest.perform(id)

    expect(topics).toBeUndefined()
  })
})
