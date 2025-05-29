import 'reflect-metadata'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

import { DeleteCourseMongoRepository } from '@functions/course/adapter/repository/MongoDB/Delete'
import { Course } from '@functions/course/entities/Course'
import { CourseModel } from '@functions/course/adapter/repository/MongoDB/model/CourseModel'

jest.mock('@common/external/database/MongoDB')

describe('DeleteCourseMongoRepository', () => {
  let mongoServer: MongoMemoryServer
  let systemUnderTest: DeleteCourseMongoRepository
  let testCourse: Course
  let createTestCourse: () => Promise<string>

  beforeAll(async () => {
    systemUnderTest = new DeleteCourseMongoRepository()
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

  it('should calls CourseModel.findOneAndDelete() with correct values', async () => {
    const findOneAndDeleteSpy = jest.spyOn(CourseModel, 'findOneAndDelete')
    const id = await createTestCourse()

    await systemUnderTest.perform(id)

    expect(findOneAndDeleteSpy).toHaveBeenCalledWith({ id })
  })

  it('should return true if CourseModel.findOneAndDelete() returns a deleted course', async () => {
    const id = await createTestCourse()

    const result = await systemUnderTest.perform(id)

    expect(result).toBe(true)
  })

  it('should return false if CourseModel.findOneAndDelete() returns null', async () => {
    const id = 'any_id'

    const result = await systemUnderTest.perform(id)

    expect(result).toBe(false)
  })
})
