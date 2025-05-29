import 'reflect-metadata'

import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { DeactivateNoticeMongoRepository } from '@functions/notice/adapter/repositories/MongoDB/MongoRepository'
import { Notice } from '@functions/notice/entities'
import { NoticeModel } from '@functions/notice/adapter/repositories/MongoDB/models/NoticeModel'

jest.mock('@common/external/database/MongoDB')

describe('Deactivate Notice Repository', () => {
  let mongoServer: MongoMemoryServer
  let systemUnderTest: DeactivateNoticeMongoRepository
  let testNotice: Notice
  let createTestNotice: () => Promise<string>

  beforeAll(async () => {
    systemUnderTest = new DeactivateNoticeMongoRepository()
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

  it('should calls NoticeModel.findOneAndUpdate() with correct values', async () => {
    const findOneAndDeleteSpy = jest.spyOn(NoticeModel, 'findOneAndUpdate')
    const id = await createTestNotice()

    await systemUnderTest.perform(id)

    expect(findOneAndDeleteSpy).toHaveBeenCalledWith({ id }, { active: false }, { new: true })
  })

  it('should return true if NoticeModel.findOneAndUpdate() returns a deactivated Notice', async () => {
    const id = await createTestNotice()

    const result = await systemUnderTest.perform(id)

    expect(result).toBe(true)
  })

  it('should return false if NoticeModel.findOneAndUpdate() returns null', async () => {
    const id = 'any_id'

    const result = await systemUnderTest.perform(id)

    expect(result).toBe(false)
  })
})
