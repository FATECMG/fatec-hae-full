import 'reflect-metadata'

import { mock, type MockProxy } from 'jest-mock-extended'

import { type FindAllFromEntityRepository } from '@common/repository/RepositoryInterface'
import { type Comment } from '@functions/comment/project/entities/Comment'
import { FindAllCommentsFromProjectUseCase } from '@functions/comment/project/useCase/FindAllComment'

describe('Find All Comments From Project', () => {
  let testComment: Comment[]
  let systemUnderTest: FindAllCommentsFromProjectUseCase
  let findAllCommentsRepository: MockProxy<FindAllFromEntityRepository<Comment>>

  beforeAll(() => {
    testComment = [{
      id: 'any_id',
      author: {
        id: 'any_author_id',
        name: 'any_author_name'
      },
      content: 'any_author_content',
      timestamp: 'any_timestamp'
    },
    {
      id: 'other_id',
      author: {
        id: 'any_author_id',
        name: 'any_author_name'
      },
      content: 'any_author_content',
      timestamp: 'any_timestamp'
    },
    {
      id: 'another_id',
      author: {
        id: 'any_author_id',
        name: 'any_author_name'
      },
      content: 'any_author_content',
      timestamp: 'any_timestamp'
    }]

    findAllCommentsRepository = mock()
    findAllCommentsRepository.perform.mockResolvedValue([])
    systemUnderTest = new FindAllCommentsFromProjectUseCase(findAllCommentsRepository)
  })

  it('should call FindAllCommentsFromProjectRepository with correct params', async () => {
    await systemUnderTest.execute('any_id')

    expect(findAllCommentsRepository.perform).toHaveBeenCalledTimes(1)
    expect(findAllCommentsRepository.perform).toHaveBeenCalledWith('any_id')
  })

  it('should returns comments when FindAllCommentsFromProjectRepository returns', async () => {
    findAllCommentsRepository.perform.mockResolvedValueOnce(testComment)

    const result = await systemUnderTest.execute('any_id')

    expect(result).toEqual(testComment)
  })

  it('should returns an empty array of comments when FindAllCommentsFromProjectRepository returns an empty array', async () => {
    findAllCommentsRepository.perform.mockResolvedValueOnce([])

    const result = await systemUnderTest.execute('any_id')

    expect(result).toEqual([])
  })

  it('should returns an empty array of comments when FindAllCommentsFromProjectRepository does not find a project', async () => {
    findAllCommentsRepository.perform.mockResolvedValueOnce([])

    const result = await systemUnderTest.execute('any_id')

    expect(result).toEqual([])
  })
})
