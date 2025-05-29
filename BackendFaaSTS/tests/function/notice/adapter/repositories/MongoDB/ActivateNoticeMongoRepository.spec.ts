import 'reflect-metadata'

import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Notice } from '@functions/notice/entities'
import { NoticeModel } from '@functions/notice/adapter/repositories/MongoDB/models/NoticeModel'
import { ActivateNoticeMongoRepository } from '@functions/notice/adapter/repositories/MongoDB/MongoRepository'

jest.mock('@common/external/database/MongoDB')

describe.only('Activate Notice Repository', () => {
  let mongoServer: MongoMemoryServer
  let systemUnderTest: ActivateNoticeMongoRepository
  let testNotice: Notice
  let createTestNotice: () => Promise<string>

  beforeAll(async () => {
    systemUnderTest = new ActivateNoticeMongoRepository()
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
      const result = await NoticeModel.create({ ...testNotice, active: false })
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
    const findOneAndUpdateSpy = jest.spyOn(NoticeModel, 'findOneAndUpdate')
    const id = await createTestNotice()
    await systemUnderTest.perform(id)

    expect(findOneAndUpdateSpy).toHaveBeenCalledWith({ id }, { active: true }, { new: true })
  })

  it('should set notice attribute to true if it is false', async () => {
    const id = await createTestNotice()
    const result = await systemUnderTest.perform(id)

    expect(result).toBeTruthy()
  })

  it('should not change active value if it is already true', async () => {
    const id = await createTestNotice()
    const result = await systemUnderTest.perform(id)

    expect(result).toBeTruthy()
  })

  it('should return false if NoticeModel.findOneAndUpdate() returns null', async () => {
    const id = 'any_id'
    const result = await systemUnderTest.perform(id)

    expect(result).toBe(false)
  })
})
