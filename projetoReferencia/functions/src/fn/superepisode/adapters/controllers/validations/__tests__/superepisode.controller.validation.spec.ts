import { CreateSuperEpisodeControllerValidation } from '../create.superepisode.controller.validation'
import { Request } from 'express'
import { ValidateJWT } from '../../../../../../shared/utils/validateJWT'
import { mocked } from 'ts-jest/utils'
import {
  generateError,
  generateValidResult,
} from '../../../../../../shared/utils/validations'
jest.mock('../../../../../../shared/utils/validateJWT')
const mockValidateJwt = mocked(ValidateJWT, true)

describe('create super episode controller validation', () => {
  const validation = new CreateSuperEpisodeControllerValidation()
  it('should not validate request cause body is missing', async () => {
    const result = await validation.validate({} as Request)
    expect(result.error).toBeDefined()
    expect(result.error.message).toBe('superepisode is missing in request body')
  })
  it('should not validate request because there is no cookies', async () => {
    mockValidateJwt.mockImplementation(() => {
      return {
        validate: jest.fn().mockImplementation(async () => {
          return generateError('cookies required')
        }),
      }
    })
    const result = await validation.validate({
      body: { superEpisode: {} },
    } as any)
    expect(result.error).toBeDefined()
    expect(result.error.message).toBe('cookies required')
  })
  it('should return the request cause it passes validation', async () => {
    mockValidateJwt.mockImplementation(() => {
      return {
        validate: jest.fn().mockImplementation(async () => {
          return generateValidResult('sometoken')
        }),
      }
    })
    const result = await validation.validate({
      body: { superEpisode: {} },
      cookies: { token: 'someimaginarytoken' },
    } as Request)
    expect(result.error).toBeUndefined()
    expect(result.value).toMatchObject({
      body: { superEpisode: {} },
    })
  })
})
