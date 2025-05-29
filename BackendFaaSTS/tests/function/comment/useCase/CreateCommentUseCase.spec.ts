import 'reflect-metadata'

import { type MockProxy, mock } from 'jest-mock-extended'

import { type UpdateEntityRepository } from '@common/repository/RepositoryInterface'
import { CommentNotCreated } from '@common/error/CommentError'
import { InfraError } from '@common/error/InfraError'
import { type Comment } from '@functions/comment/project/entities/Comment'
import { CreateCommentProjectUseCase } from '@functions/comment/project/useCase/CreateComment'

describe('Create Comment Project UseCase', () => {
  let systemUnderTest: CreateCommentProjectUseCase
  let commentRepository: MockProxy<UpdateEntityRepository<Comment>>
  let templateComment: Comment

  beforeAll(() => {
    templateComment = {
      id: 'any_id',
      author: {
        id: 'any_author_id',
        name: 'any_author_name'
      },
      content: 'any_author_content',
      timestamp: 'any_timestamp'
    }

    commentRepository = mock()
    commentRepository.perform.mockResolvedValue(templateComment)
    systemUnderTest = new CreateCommentProjectUseCase(commentRepository)
  })

  it('should call CommentRepository.perform with correct params', async () => {
    await systemUnderTest.execute('any_id', templateComment)

    expect(commentRepository.perform).toHaveBeenCalledTimes(1)
    expect(commentRepository.perform).toHaveBeenCalledWith(templateComment, 'any_id')
  })

  it('should return the comment made when repo returns', async () => {
    const result = await systemUnderTest.execute('any_id', templateComment)

    expect(result).toEqual(templateComment)
  })

  it('should return CommentNotCreated when CommentRepository returns undefined', async () => {
    commentRepository.perform.mockResolvedValueOnce(undefined)

    const result = await systemUnderTest.execute('any_id', templateComment)

    expect(result).toEqual(new CommentNotCreated())
  })

  it('should return InfraError when CommentRepository throws any other error', async () => {
    commentRepository.perform.mockRejectedValueOnce(new Error('any_error'))

    const result = await systemUnderTest.execute('any_id', templateComment)

    expect(result).toStrictEqual(new InfraError('Erro inesperado!'))
  })
})
