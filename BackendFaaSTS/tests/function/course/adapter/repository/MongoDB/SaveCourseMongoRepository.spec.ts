import 'reflect-metadata'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { type MockProxy, mock } from 'jest-mock-extended'
import { type MongoServerError } from 'mongodb'

import { isMongoDuplicationError, getPropertyNameFromError, getPropertyTranslation } from '@common/utils/mongo/MongoErrorUtils'
import { Course } from '@functions/course/entities/Course'
import { SaveCourseMongoRepository } from '@functions/course/adapter/repository/MongoDB/Save'
import { CourseModel } from '@functions/course/adapter/repository/MongoDB/model/CourseModel'

jest.mock('@common/external/database/MongoDB')
jest.mock('@common/utils/mongo/MongoErrorUtils')
jest.mock('@functions/course/adapter/repository/MongoDB/model/CourseModel')

describe('SaveCourseMongoRepository', () => {
  let mockedError: MockProxy<MongoServerError>
  let mongoServer: MongoMemoryServer
  let systemUnderTest: SaveCourseMongoRepository
  let testCourse: Course

  beforeAll(async () => {
    mockedError = mock()
    mockedError.code = 11000
    systemUnderTest = new SaveCourseMongoRepository()
    mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri(), {})

    testCourse = new Course({
      name: 'any_name',
      acronym: 'any_acronym',
      code: 'any_code',
      coordinator: 'any_coordinator',
      schedule: ['Noturno'],
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

  it('should create CourseModel object with correct params', async () => {
    const spy = jest.spyOn(CourseModel.prototype, 'constructor').mockImplementationOnce(() => {})

    await systemUnderTest.perform(testCourse)

    expect(spy).toHaveBeenCalledWith(testCourse)
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('should save a course correctly', async () => {
    const user = await systemUnderTest.perform(testCourse)

    expect(user).toEqual(testCourse)
  })

  it('should throw DuplicatedFieldError if user send duplicated name to be saved', async () => {
    mockedError.keyPattern = { name: 1 }
    const otherCourse = new Course({ ...testCourse, code: 'other_code' }, 'other_id')
    await systemUnderTest.perform(testCourse)
    jest.spyOn(CourseModel.prototype, 'save').mockRejectedValueOnce(mockedError)
    jest.mocked(isMongoDuplicationError).mockReturnValueOnce(true)
    jest.mocked(getPropertyNameFromError).mockReturnValueOnce('name')
    jest.mocked(getPropertyTranslation).mockReturnValueOnce('Nome')

    const promise = systemUnderTest.perform(otherCourse)

    await expect(promise).rejects.toThrow('Nome any_name já existe!')
  })

  it('should throw DuplicatedFieldError if user send duplicated code to be saved', async () => {
    mockedError.keyPattern = { name: 1 }
    await systemUnderTest.perform(testCourse)
    const otherCourse = new Course({ ...testCourse, name: 'other_name' }, 'other_id')
    jest.spyOn(CourseModel.prototype, 'save').mockRejectedValueOnce(mockedError)
    jest.mocked(isMongoDuplicationError).mockReturnValueOnce(true)
    jest.mocked(getPropertyNameFromError).mockReturnValueOnce('code')
    jest.mocked(getPropertyTranslation).mockReturnValueOnce('Código')

    const promise = systemUnderTest.perform(otherCourse)

    await expect(promise).rejects.toThrow('Código any_code já existe!')
  })
})
