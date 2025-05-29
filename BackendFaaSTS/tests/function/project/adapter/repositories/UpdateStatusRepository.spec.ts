import 'reflect-metadata'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { UpdateStatusRepository } from '@functions/project/adapter/repositories/MongoDB/UpdateStatus'
import { type Project } from '@functions/project/entities/Project'
import { ProjectModel } from '@functions/project/adapter/repositories/MongoDB/model/ProjectModel'

jest.mock('@common/external/database/MongoDB')

describe.only('Change Project Status MongoRepository', () => {
  let mongoServer: MongoMemoryServer
  let systemUnderTest: UpdateStatusRepository
  let testProject: Project
  let createTestProject: () => Promise<string>

  beforeAll(async () => {
    systemUnderTest = new UpdateStatusRepository()
    mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri(), {})

    testProject = {
      id: 'any_id',
      title: 'any_title',
      description: 'any_description',
      justification: 'any_justification',
      references: 'any_references',
      objectives: 'any_objectives',
      methodology: 'any_methodology',
      complianceModel: 'any_complianceModel',
      topicsOfInterest: ['any_topic'],
      schedule: 'any_schedule',
      hours: {
        proposed: 'any_proposed_hours',
        approved: 'any_approved_hours'
      },
      notice: {
        id: 'any_notice_id',
        title: 'any_notice_title'
      },
      author: {
        id: 'any_author_id',
        name: 'any_author_name'
      },
      comments: [],
      active: false,
      status: 'any_status'
    }

    createTestProject = async (): Promise<string> => {
      const result = await ProjectModel.create(testProject)
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

  it('should calls ProjectModel.findOneAndUpdate() with correct values', async () => {
    const findOneAndUpdateSpy = jest.spyOn(ProjectModel, 'findOneAndUpdate')
    const id = await createTestProject()

    await systemUnderTest.perform(id, 'any_new_status')

    expect(findOneAndUpdateSpy).toHaveBeenCalledWith({ id }, { status: 'any_new_status' }, { new: true })
  })

  it('should return true if status is successfuly updated', async () => {
    const id = await createTestProject()

    const result = await systemUnderTest.perform(id, 'any_new_status')

    expect(result).toBe(true)
  })

  it('should return false if ProjectModel.findOneAndUpdate() returns null', async () => {
    const id = 'any_id'

    const result = await systemUnderTest.perform(id, 'any_new_status')

    expect(result).toBe(false)
  })
})
