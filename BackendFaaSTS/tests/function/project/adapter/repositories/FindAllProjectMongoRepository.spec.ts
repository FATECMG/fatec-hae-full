import 'reflect-metadata'
import mongoose from 'mongoose'

import { MongoMemoryServer } from 'mongodb-memory-server'
import { FindAllProjectRepository } from '@functions/project/adapter/repositories/MongoDB/FindAll'
import { type Project } from '@functions/project/entities/Project'
import { ProjectModel } from '@functions/project/adapter/repositories/MongoDB/model/ProjectModel'

jest.mock('@common/external/database/MongoDB')

describe.only('Find All Projects MongoRepository', () => {
  let mongoServer: MongoMemoryServer
  let systemUnderTest: FindAllProjectRepository
  let testProject: Project
  let createTestProject: () => Promise<string[]>

  beforeAll(async () => {
    systemUnderTest = new FindAllProjectRepository()
    mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri(), {})

    testProject = {
      id: 'any_id',
      title: 'any_title',
      description: 'any_description',
      justification: 'any_justification',
      objectives: 'any_objectives',
      methodology: 'any_methodology',
      references: 'any_references',
      schedule: 'any_schedule',
      complianceModel: 'any_complianceModel',
      topicsOfInterest: ['any_topic'],
      hours: {
        proposed: 'any_proposed',
        approved: 'any_approved'
      },
      author: {
        id: 'any_id',
        name: 'any_name'
      },
      notice: {
        id: 'any_id',
        title: 'any_title'
      },
      comments: [],
      status: 'any_status',
      active: true
    }

    createTestProject = async (): Promise<string[]> => {
      const ids: string[] = []
      const project1 = await ProjectModel.create(testProject)
      const project2 = await ProjectModel.create({ ...testProject, id: 'any_id_2', active: true, status: 'any_status_2' })
      const project3 = await (await ProjectModel.create({ ...testProject, id: 'any_id_3', active: true, status: 'any_status_3' }))

      ids.push(project1.id)
      ids.push(project2.id)
      ids.push(project3.id)
      return ids
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

  it('should return an array of projects on success', async () => {
    await createTestProject()
    const result = await systemUnderTest.perform({ active: true, status: ['any_status'] })

    expect(result).not.toBeUndefined()
    expect(result.length).toBe(1)
  })

  it('should return an empty array if no projects is found', async () => {
    const result = await systemUnderTest.perform({ active: true, status: ['any_status_4'] })

    expect(result).not.toBeUndefined()
    expect(result.length).toBe(0)
  })

  it('should return an empty array if an status is not found', async () => {
    await createTestProject()
    const result = await systemUnderTest.perform({ active: true, status: ['any_inexistent_status'] })

    expect(result).not.toBeUndefined()
    expect(result.length).toBe(0)
  })

  it('should return projects with status any_status_2 and any_status_3 and active true', async () => {
    await createTestProject()
    const result = await systemUnderTest.perform({ active: true, status: ['any_status_2', 'any_status_3'] })

    expect(result).not.toBeUndefined()
    expect(result.length).toBe(2)
  })

  it('should return projects if status one of two status is inexistent', async () => {
    await createTestProject()
    const result = await systemUnderTest.perform({ active: true, status: ['any_status_2', 'any_inexistent_status'] })

    expect(result).not.toBeUndefined()
    expect(result.length).toBe(1)
  })
})
