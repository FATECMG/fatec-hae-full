import 'reflect-metadata'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { type MongoServerError } from 'mongodb'
import { mock, type MockProxy } from 'jest-mock-extended'
import { Notice } from '@functions/notice/entities'
import { NoticeModel } from '@functions/notice/adapter/repositories/MongoDB/models/NoticeModel'
import { type NoticeProps } from '@functions/notice/entities/Notice'
import { errorLabel } from '@functions/notice/adapter/repositories/MongoDB/utils/errorLabel'
import { DuplicatedFieldError } from '@common/error/DuplicatedFieldError'
import { UpdateNoticeMongoRepository } from '@functions/notice/adapter/repositories/MongoDB/MongoRepository'

jest.mock('@common/external/database/MongoDB')

describe.only('Update Notice Repository', () => {
  let mockedError: MockProxy<MongoServerError>
  let mongoServer: MongoMemoryServer
  let systemUnderTest: UpdateNoticeMongoRepository
  let testNotice: Notice
  let createTestNotice: () => Promise<string>

  beforeAll(async () => {
    mockedError = mock()
    mockedError.code = 11000
    mockedError.keyPattern = { name: 1 }
    systemUnderTest = new UpdateNoticeMongoRepository()
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

  it('should update notice on success', async () => {
    const noticeUpdated: NoticeProps = {
      title: 'any_title_updated',
      description: 'any_description_updated',
      openDate: 'any_openDate_updated',
      closeDate: 'any_closeDate_updated',
      evaluationEndDate: 'any_evaluationEndDate_updated',
      semester: 'any_semester_updated',
      year: 'any_year_updated',
      topicsOfInterest: ['any_topicOfInterest_updated'],
      active: true
    }

    const id = await createTestNotice()
    const result = await systemUnderTest.perform(new Notice(noticeUpdated), id)
    expect(result).toEqual(new Notice({ ...noticeUpdated }, id))
  })

  it('should update notice name on success', async () => {
    const newTitle = 'any_title_updated'
    testNotice.title = newTitle
    const id = await createTestNotice()
    const result = await systemUnderTest.perform(testNotice, id)
    expect(result?.title).toBe(newTitle)
  })

  it('should return undefined if notice is not found', async () => {
    const result = await systemUnderTest.perform(testNotice, 'any_inexistent_id')
    expect(result).toBeUndefined()
  })

  it('should return DuplicatedFieldError if title is duplicated', async () => {
    mockedError.keyPattern = { title: 1 }
    const id = await createTestNotice()
    const other = await new NoticeModel({ ...testNotice, title: 'other_title', id: 'other_id' }).save({ safe: true })
    const result = systemUnderTest.perform({ ...testNotice, title: 'other_title' }, id)

    await expect(result).rejects.toThrow(new DuplicatedFieldError({
      entity: other,
      errorLabel,
      mongoError: mockedError,
      possibleDuplicatedFields: 'title'
    }))
  })
})
