import { CreateSuperEpisodeUseCaseValidation } from '../create.superepisode.usecase.validation'

describe('create superepisode usecase validation', () => {
  const validation = new CreateSuperEpisodeUseCaseValidation()
  it('should fail at validating superepisode', async () => {
    const result = await validation.validate({})
    expect(result.error).toBeDefined()
    expect(result.error.message).toBe('"name" is required')
  })
  it('should pass at validation superepisode', async () => {
    const result = await validation.validate({ name: 'Feira X' })
    expect(result.value).toMatchObject({ name: 'Feira X' })
  })
})
