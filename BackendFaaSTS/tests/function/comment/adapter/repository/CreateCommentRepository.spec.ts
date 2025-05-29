import 'reflect-metadata'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { CreateCommentProjectMongoRepository } from '@functions/comment/project/adapter/repositories/MongoDB/CreateComment'
import { type Comment } from '@functions/comment/project/entities/Comment'
import { ProjectModel } from '@functions/project/adapter/repositories/MongoDB/model/ProjectModel'
import { Project } from '@functions/project/entities/Project'
import { toDomain } from '@functions/project/adapter/repositories/MongoDB/utils/toDomain'

jest.mock('@common/external/database/MongoDB')

describe('Create Project Comment MongoRepository', () => {
  let mongoServer: MongoMemoryServer
  let systemCreateCommentRepositoryUnderTest: CreateCommentProjectMongoRepository
  let testComment: Comment
  let testProject: Project
  let createTestProject: (project: Project) => Promise<Project>

  beforeAll(async () => {
    systemCreateCommentRepositoryUnderTest = new CreateCommentProjectMongoRepository()
    mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri(), {})

    testComment = {
      id: 'any_comment_id',
      author: {
        id: 'any_author_id',
        name: 'any_author_name'
      },
      content: 'any_author_content',
      timestamp: 'any_timestamp'
    }

    testProject = new Project({
      author: {
        id: 'any_author_id',
        name: 'any_author_name'
      },
      comments: [],
      notice: {
        id: 'any_notice_id',
        title: 'any_notice_title'
      },
      title: 'any_title',
      description: 'any_description',
      objectives: 'any_objectives',
      methodology: 'any_methodologies',
      justification: 'any_justification',
      references: 'any_references',
      topicsOfInterest: ['any_topic_of_Interest'],
      complianceModel: 'any_compliance_model',
      schedule: 'any_schedule',
      hours: {
        proposed: 'any_hours_proposed',
        approved: 'any_hours_invested'
      },
      active: true,
      status: 'any_status'
    })

    createTestProject = async (project: Project): Promise<Project> => {
      const result = await ProjectModel.create(project)
      return toDomain(result)
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
    const findOneSpy = jest.spyOn(ProjectModel, 'findOneAndUpdate')
    const response = await createTestProject(testProject)
    const id = response.id

    await systemCreateCommentRepositoryUnderTest.perform(testComment, id)

    expect(findOneSpy).toHaveBeenCalledWith({ id }, { $push: { comments: testComment } }, { new: true })

    expect(findOneSpy).toHaveBeenCalledTimes(1)
  })

  it('should create a comment in a project on success', async () => {
    const { id } = await createTestProject(testProject)

    const result = await systemCreateCommentRepositoryUnderTest.perform(testComment, id)

    expect(result).toEqual(testComment)
  })

  it('should return undefined if no project was found to be updated', async () => {
    await createTestProject(testProject)

    const result = await systemCreateCommentRepositoryUnderTest.perform(testComment, 'any_invalid_id')

    expect(result).toBeUndefined()
  })
})
