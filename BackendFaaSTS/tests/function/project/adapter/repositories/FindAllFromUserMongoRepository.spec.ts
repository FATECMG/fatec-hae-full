import 'reflect-metadata'
import mongoose from 'mongoose'

import { MongoMemoryServer } from 'mongodb-memory-server'

import { type Project } from '@functions/project/entities/Project'
import { ProjectModel } from '@functions/project/adapter/repositories/MongoDB/model/ProjectModel'
import { type User } from '@functions/user/entities/User'
import { UserModel } from '@functions/user/adapter/repositories/MongoDB/models/UserModel'
import { type FindAllFromEntityRepository } from '@common/repository/RepositoryInterface'
import { FindAllProjectFromUserIdRepository } from '@functions/project/adapter/repositories/MongoDB/FindAllFromUser'

jest.mock('@common/external/database/MongoDB')

describe.only('Find All Projects From User MongoRepository', () => {
  let mongoServer: MongoMemoryServer
  let systemUnderTest: FindAllFromEntityRepository<Project>
  let testProject: Project
  let testUser: User
  let createTestProject: () => Promise<string>
  let createTestUser: () => Promise<string>

  beforeAll(async () => {
    systemUnderTest = new FindAllProjectFromUserIdRepository()
    mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri(), {})

    testUser = {
      id: 'any_id',
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
      courses: [
        {
          id: 'any_id',
          name: 'any_name'
        }
      ],
      roles: 'any_role',
      academicTitle: 'GRADUADO',
      phone: 'any_phone',
      registerNumber: 'any_register_number',
      active: true
    }

    testProject = {
      id: 'any_id',
      title: 'any_title',
      description: 'any_description',
      justification: 'any_justification',
      objectives: 'any_objectives',
      methodology: 'any_methodology',
      references: 'any_references',
      schedule: 'any_schedule',
      complianceModel: 'A DEFINIR',
      topicsOfInterest: ['any_topic'],
      hours: {
        proposed: 'any_proposed',
        approved: 'EM ANÁLISE'
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
      status: 'RASCUNHO',
      active: true
    }

    createTestUser = async (): Promise<string> => {
      const user1 = await UserModel.create(testUser)
      return user1.id
    }

    createTestProject = async (): Promise<string> => {
      const project1 = await ProjectModel.create(testProject)
      return project1.id
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

  it('should return projects from an user if it exists', async () => {
    const userId = await createTestUser()
    await createTestProject()

    const projects = await systemUnderTest.perform(userId)
    expect(projects).toEqual([testProject])
  })
})
