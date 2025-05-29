import { CommentDTO } from '@functions/comment/project/entities/CommentDTO'

describe.only('CommentDTO', () => {
  it('should create a comment with the correct properties', () => {
    const comment = new CommentDTO({
      author: {
        id: 'any_author_id',
        name: 'any_author_name'
      },
      content: 'any_author_content'
    })
    expect(comment).toEqual({
      author: {
        id: 'any_author_id',
        name: 'any_author_name'
      },
      content: 'any_author_content'
    })
  })
})
