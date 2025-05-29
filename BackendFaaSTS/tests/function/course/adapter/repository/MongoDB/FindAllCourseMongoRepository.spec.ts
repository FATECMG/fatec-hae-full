import 'reflect-metadata'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

import { CourseModel } from '@functions/course/adapter/repository/MongoDB/model/CourseModel'
import { Course } from '@functions/course/entities/Course'
import { FindAllCourseMongoRepository } from '@functions/course/adapter/repository/MongoDB/FindAll'

jest.mock('@common/external/database/MongoDB')

describe('FindAllCourseMongoRepository', () => {
  let mongoServer: MongoMemoryServer
  let systemUnderTest: FindAllCourseMongoRepository
  let testCourse: Course
  let createTestCourse: () => Promise<string>

  beforeAll(async () => {
    systemUnderTest = new FindAllCourseMongoRepository()
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

  it('should calls CourseModel.find() with correct values', async () => {
    const findSpy = jest.spyOn(CourseModel, 'find')

    await systemUnderTest.perform(true)

    expect(findSpy).toHaveBeenCalledWith({ active: true })
    expect(findSpy).toHaveBeenCalledTimes(1)
  })

  it('should return empty array if CourseModel.find() returns empty array', async () => {
    const result = await systemUnderTest.perform(true)

    expect(result).toEqual([])
  })

  it('should return all courses', async () => {
    await createTestCourse()

    const result = await systemUnderTest.perform(true)

    expect(result).toEqual([testCourse])
  })
})
