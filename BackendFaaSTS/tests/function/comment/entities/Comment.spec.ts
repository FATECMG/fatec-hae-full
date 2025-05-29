import { Comment } from '@functions/comment/project/entities/Comment'

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('any_uuid')
}))

describe.only('Comment Entity', () => {
  it('should create a comment with the correct properties', () => {
    const mockDate = new Date('2023-07-06T13:57:18.177Z')
    const spyDate = jest.spyOn(global, 'Date').mockImplementation(() => mockDate)
    const date = new Date()
    const comment = new Comment({
      author: {
        id: 'any_author_id',
        name: 'any_author_name'
      },
      content: 'any_author_content'
    })
    expect(comment).toEqual({
      id: 'any_uuid',
      author: {
        id: 'any_author_id',
        name: 'any_author_name'
      },
      content: 'any_author_content',
      timestamp: date.toISOString()
    })
    spyDate.mockRestore()
  })
})
