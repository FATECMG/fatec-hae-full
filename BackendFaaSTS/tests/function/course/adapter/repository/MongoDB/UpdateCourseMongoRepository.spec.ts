import 'reflect-metadata'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { type MockProxy, mock } from 'jest-mock-extended'
import { type MongoServerError } from 'mongodb'

import { DuplicatedFieldError } from '@common/error/DuplicatedFieldError'
import { errorLabel } from '@functions/course/adapter/repository/MongoDB/utils'
import { Course } from '@functions/course/entities/Course'
import { CourseModel } from '@functions/course/adapter/repository/MongoDB/model/CourseModel'
import { UpdateCourseMongoRepository } from '@functions/course/adapter/repository/MongoDB/Update'

jest.mock('@common/external/database/MongoDB')

describe('UpdateCourseMongoRepository', () => {
  let mockedError: MockProxy<MongoServerError>
  let mongoServer: MongoMemoryServer
  let systemUnderTest: UpdateCourseMongoRepository
  let testCourse: Course
  let createTestCourse: () => Promise<string>

  beforeAll(async () => {
    mockedError = mock()
    mockedError.code = 11000
    systemUnderTest = new UpdateCourseMongoRepository()
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

    createTestCourse = async (): Promise<string> => {
      const result = await CourseModel.create(testCourse)
      return result.id
    }
  })

  afterEach(async () => {
    const collections = mongoose.connection.collections
    for (const key in collections) {
      if (key === 'roles') continue
      const collection = collections[key]
      await collection.deleteMany()
    }
  })

  afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    await mongoServer.stop()
  })

  it('should update a course', async () => {
    const id = await createTestCourse()

    const result = await systemUnderTest.perform({ ...testCourse, schedule: ['Matutino', 'Noturno'] }, id)

    expect(result).toEqual({ ...testCourse, schedule: ['Matutino', 'Noturno'] })
  })

  it('should return undefined if course is not found to be updated', async () => {
    const result = await systemUnderTest.perform(testCourse, 'any_id')

    expect(result).toBeUndefined()
  })

  it('should throw a DuplicatedFieldError if duplicated code is sent to be update', async () => {
    mockedError.keyPattern = { code: 1 }
    const id = await createTestCourse()
    const other = await new CourseModel({ ...testCourse, code: 'other_code', name: 'other_name', id: 'other_id' }).save({ safe: true })

    const result = systemUnderTest.perform({ ...testCourse, code: 'other_code' }, id)

    await expect(result).rejects.toThrow(new DuplicatedFieldError({
      entity: other,
      errorLabel,
      mongoError: mockedError,
      possibleDuplicatedFields: 'code'
    }))
  })

  it('should throw a DuplicatedFieldError if duplicated name is sent to be update', async () => {
    mockedError.keyPattern = { name: 1 }
    const id = await createTestCourse()
    const other = await new CourseModel({ ...testCourse, code: 'other_code', name: 'other_name', id: 'other_id' }).save({ safe: true })

    const result = systemUnderTest.perform({ ...testCourse, name: 'other_name' }, id)

    await expect(result).rejects.toThrow(new DuplicatedFieldError({
      entity: other,
      errorLabel,
      mongoError: mockedError,
      possibleDuplicatedFields: 'name'
    }))
  })
})
