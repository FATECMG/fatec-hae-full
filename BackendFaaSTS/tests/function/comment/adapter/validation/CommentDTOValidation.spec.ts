import 'reflect-metadata'

import { ValidationError } from '@common/error/ValidationError'
import CommentZodValidation from '@functions/comment/project/adapter/validation/CommentZodValidation'
import { type CommentDTO } from '@functions/comment/project/entities/CommentDTO'

describe('Comment Zod Validation', () => {
  let systemCommentZodValidtionUnderTest: CommentZodValidation
  let baseComment: CommentDTO

  beforeAll(() => {
    systemCommentZodValidtionUnderTest = new CommentZodValidation()

    baseComment = {
      author: {
        id: 'any_author_id',
        name: 'any_name_id'
      },
      content: 'any_content'
    }
  })

  it('should return undefined if the Comment is valid', () => {
    const result = systemCommentZodValidtionUnderTest.validate(baseComment)
    expect(result).toBeUndefined()
  })

  it('should return ValidationError if empty author is sent', () => {
    const result = systemCommentZodValidtionUnderTest.validate({ ...baseComment, author: {} })
    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if empty author name is sent', () => {
    const result = systemCommentZodValidtionUnderTest.validate({ ...baseComment, author: { id: 'any_author_id', name: '' } })
    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if empty author id is sent', () => {
    const result = systemCommentZodValidtionUnderTest.validate({ ...baseComment, author: { id: '', name: 'any_author_name' } })
    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if author id with blank space is sent', () => {
    const result = systemCommentZodValidtionUnderTest.validate({ ...baseComment, author: { id: ' ', name: 'any_author_name' } })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if author name with blank space is sent', () => {
    const result = systemCommentZodValidtionUnderTest.validate({ ...baseComment, author: { id: 'any_author_id', name: ' ' } })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if null author is sent', () => {
    const result = systemCommentZodValidtionUnderTest.validate({ ...baseComment, author: null })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if null author name is sent', () => {
    const result = systemCommentZodValidtionUnderTest.validate({ ...baseComment, author: { id: 'any_author_id', name: null } })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if null author id is sent', () => {
    const result = systemCommentZodValidtionUnderTest.validate({ ...baseComment, author: { id: null, name: 'any_author_name' } })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if undefined author is sent', () => {
    const result = systemCommentZodValidtionUnderTest.validate({ ...baseComment, author: undefined })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if undefined author name is sent', () => {
    const result = systemCommentZodValidtionUnderTest.validate({ ...baseComment, author: { id: 'any_author_id', name: undefined } })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if undefined author id is sent', () => {
    const result = systemCommentZodValidtionUnderTest.validate({ ...baseComment, author: { id: undefined, name: 'any_author_name' } })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if empty content is sent', () => {
    const result = systemCommentZodValidtionUnderTest.validate({ ...baseComment, content: '' })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if empty content with blank space is sent', () => {
    const result = systemCommentZodValidtionUnderTest.validate({ ...baseComment, content: '  ' })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if null content is sent', () => {
    const result = systemCommentZodValidtionUnderTest.validate({ ...baseComment, content: null })

    expect(result).toEqual(new ValidationError([]))
  })

  it('should return ValidationError if undefined content is sent', () => {
    const result = systemCommentZodValidtionUnderTest.validate({ ...baseComment, content: undefined })

    expect(result).toEqual(new ValidationError([]))
  })
})
