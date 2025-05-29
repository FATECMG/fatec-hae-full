import 'reflect-metadata'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

import { ActivateCourseMongoRepository } from '@functions/course/adapter/repository/MongoDB/Activate'
import { Course } from '@functions/course/entities/Course'
import { CourseModel } from '@functions/course/adapter/repository/MongoDB/model/CourseModel'

jest.mock('@common/external/database/MongoDB')

describe('ActivateCourseMongoRepository', () => {
  let mongoServer: MongoMemoryServer
  let systemUnderTest: ActivateCourseMongoRepository
  let testCourse: Course
  let createTestCourse: () => Promise<string>

  beforeAll(async () => {
    systemUnderTest = new ActivateCourseMongoRepository()
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

  it('should calls CourseModel.findOneAndUpdate() with correct values', async () => {
    const findOneAndDeleteSpy = jest.spyOn(CourseModel, 'findOneAndUpdate')
    const id = await createTestCourse()

    await systemUnderTest.perform(id)

    expect(findOneAndDeleteSpy).toHaveBeenCalledWith({ id }, { active: true }, { new: true })
  })

  it('should return true if CourseModel.findOneAndUpdate() returns a activated course', async () => {
    const id = await createTestCourse()

    const result = await systemUnderTest.perform(id)

    expect(result).toBe(true)
  })

  it('should return false if CourseModel.findOneAndUpdate() returns null', async () => {
    const id = 'any_id'

    const result = await systemUnderTest.perform(id)

    expect(result).toBe(false)
  })
})
