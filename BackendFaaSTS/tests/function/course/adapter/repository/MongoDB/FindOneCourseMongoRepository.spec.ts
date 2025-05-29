import 'reflect-metadata'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

import { CourseModel } from '@functions/course/adapter/repository/MongoDB/model/CourseModel'
import { Course } from '@functions/course/entities/Course'
import { FindOneCourseMongoRepository } from '@functions/course/adapter/repository/MongoDB/FindOne'

jest.mock('@common/external/database/MongoDB')

describe('FindOneCourseMongoRepository', () => {
  let mongoServer: MongoMemoryServer
  let systemUnderTest: FindOneCourseMongoRepository
  let testCourse: Course
  let createTestCourse: () => Promise<string>

  beforeAll(async () => {
    systemUnderTest = new FindOneCourseMongoRepository()
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
      const collection = collections[key]
      await collection.deleteMany()
    }
  })

  afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    await mongoServer.stop()
  })

  it('should calls CourseModel.findOne() with correct values', async () => {
    const findOneSpy = jest.spyOn(CourseModel, 'findOne')
    const id = await createTestCourse()

    await systemUnderTest.perform(id)

    expect(findOneSpy).toHaveBeenCalledWith({ id })
    expect(findOneSpy).toHaveBeenCalledTimes(1)
  })

  it('should returns undefined if CourseModel.findOne() returns null', async () => {
    await createTestCourse()

    const result = await systemUnderTest.perform('any_non_existent_id')

    expect(result).toBeUndefined()
  })

  it('should returns a Course if CourseModel.findOne() returns a Course', async () => {
    const id = await createTestCourse()

    const result = await systemUnderTest.perform(id)

    expect(result).toEqual(testCourse)
  })
})
