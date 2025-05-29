import 'reflect-metadata'

import { CommentMapper, CommentPresentationModelMapper } from '@functions/comment/project/adapter/mapper/Comment.mapper'
import { type Comment } from '@functions/comment/project/entities/Comment'
import { CommentDTO } from '@functions/comment/project/entities/CommentDTO'

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('any_id')
}))
jest.useFakeTimers().setSystemTime(new Date('2021-01-01T00:00:00.000Z'))

describe('CommentDTOMapper', () => {
  let comment: CommentDTO

  beforeEach(() => {
    comment = {
      author: {
        id: 'any_author_id',
        name: 'any_author_name'
      },
      content: 'any_content'
    }
  })

  it('should map with the same data uppercased', async () => {
    const sutCommentMapper = new CommentMapper()
    const result = await sutCommentMapper.execute(new CommentDTO(comment))
    expect(result).toEqual({
      id: 'any_id',
      author: {
        id: result.author.id,
        name: result.author.name
      },
      content: result.content,
      timestamp: new Date().toISOString()
    })
  })
})

describe('commentPresentationModelMapper', () => {
  let comment: Comment

  beforeEach(() => {
    comment = {
      id: 'any_id',
      author: {
        id: 'any_author_id',
        name: 'any_author_name'
      },
      content: 'any_author_content',
      timestamp: 'any_timestamp'
    }
  })

  it('should map with the same data', async () => {
    const sutCommentPresentationModelMapper = new CommentPresentationModelMapper()
    const commentEntity = { ...comment }

    const result = await sutCommentPresentationModelMapper.execute(commentEntity)

    expect(result).toEqual({
      id: result.id,
      author: {
        id: result.author.id,
        name: result.author.name
      },
      content: result.content,
      timestamp: result.timestamp
    })
  })
})
