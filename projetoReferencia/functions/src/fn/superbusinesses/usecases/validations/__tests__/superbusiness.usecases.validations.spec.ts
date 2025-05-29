import { LoginSuperBusinessValidation } from '../login.superbusiness.usecases.validation'
describe('login superbusiness validation usecase', () => {
  const validation = new LoginSuperBusinessValidation()
  it('should not pass in validation because email is invalid', async () => {
    const superbusiness = { email: 'aaaaa' }
    const result = await validation.validate(superbusiness)
    expect(result.error.message).toBe('"email" must be a valid email')
  })
  it('should not pass in validation because email is missing', async () => {
    const superbusiness = {}
    const result = await validation.validate(superbusiness)
    expect(result.error.message).toBe('"email" is required')
  })
  it('should not pass in validation because password is missing', async () => {
    const superbusiness = { email: 'dev@zelpay.solutions' }
    const result = await validation.validate(superbusiness)
    expect(result.error.message).toBe('"password" is required')
  })
})
