import 'reflect-metadata'

import { MongoMemoryServer } from 'mongodb-memory-server'
import { FindAllCommentsFromProjectRepository } from '@functions/comment/project/adapter/repositories/MongoDB/FindAllComments'
import { Project } from '@functions/project/entities/Project'
import { type Comment } from '@functions/comment/project/entities/Comment'

import mongoose from 'mongoose'
import { ProjectModel } from '@functions/project/adapter/repositories/MongoDB/model/ProjectModel'
import { toDomain } from '@functions/project/adapter/repositories/MongoDB/utils'

jest.mock('@common/external/database/MongoDB')

describe.only('Find All Comments From a Project Repository', () => {
  let mongoServer: MongoMemoryServer
  let systemFindAllCommentUnderTest: FindAllCommentsFromProjectRepository
  let testComment: Comment[]
  let testProject: Project
  let createTestProject: (project: Project) => Promise<Project>

  beforeAll(async () => {
    systemFindAllCommentUnderTest = new FindAllCommentsFromProjectRepository()
    mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri(), {})

    testComment = [{
      id: 'any_comment_id',
      author: {
        id: 'any_author_id',
        name: 'any_author_name'
      },
      content: 'any_author_content',
      timestamp: 'any_timestamp'
    },
    {
      id: 'any_comment_id',
      author: {
        id: 'any_author_id',
        name: 'any_author_name'
      },
      content: 'any_author_content',
      timestamp: 'any_timestamp'
    },
    {
      id: 'any_comment_id',
      author: {
        id: 'any_author_id',
        name: 'any_author_name'
      },
      content: 'any_author_content',
      timestamp: 'any_timestamp'
    }]

    testProject = new Project({
      author: {
        id: 'any_author_id',
        name: 'any_author_name'
      },
      comments: testComment,
      title: 'any_title',
      notice: {
        id: 'any_notice_id',
        title: 'any_notice_title'
      },
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

  it('should calls ProjectModel.findOne() with correct values', async () => {
    const findOneSpy = jest.spyOn(ProjectModel, 'findOne')
    const project = await createTestProject(testProject)
    const id = project.id
    await systemFindAllCommentUnderTest.perform(id)

    expect(findOneSpy).toHaveBeenCalledWith({ id })
    expect(findOneSpy).toHaveBeenCalledTimes(1)
  })

  it('should return an array of comments if project exists and has comments', async () => {
    const project = await createTestProject(testProject)
    const id = project.id

    const result = await systemFindAllCommentUnderTest.perform(id)
    expect(result).not.toBeUndefined()
    expect(result).toEqual(testComment)
  })

  it('should return an empty array if it has no comments exists', async () => {
    const project = await createTestProject({ ...testProject, comments: [] })
    const id = project.id

    const result = await systemFindAllCommentUnderTest.perform(id)
    expect(result).not.toBeUndefined()
    expect(result).toEqual([])
  })

  it('should return an empty array if it not exists', async () => {
    const result = await systemFindAllCommentUnderTest.perform('any_inexistent_id')
    expect(result).toEqual([])
  })
})
