import { CreateControllerValidation } from '../create.controller.validation'

describe('create.controller.validation', () => {
  const createControllerValidation = new CreateControllerValidation()
  it('should try to validade empty body and return with an error and error message defined', async () => {
    let result = await createControllerValidation.validate({} as any)
    expect(result.error).toBeDefined()
    expect(result.error.message).toBe('No business provided')
    result = await createControllerValidation.validate({ body: {} } as any)
    expect(result.error).toBeDefined()
    expect(result.error.message).toBe('No business provided')
  })
})
