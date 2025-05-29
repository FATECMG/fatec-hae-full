import 'reflect-metadata'
import { Container } from 'inversify'
import { Request } from 'express'
import { Handler } from '../../../../../shared/adapters/controllers/interfaces'
import { Locator } from '../../../shared/di.enums'
import { CreateSuperEpisodeController } from '../create.superepisode.controller'
import { ICreateSuperEpisodeUseCase } from '../../../usecases/interfaces.superepisode.usecase'
import { ValidateJWT } from '../../../../../shared/utils/validateJWT'
import { mocked } from 'ts-jest/utils'

jest.mock('../../../../../shared/utils/validateJWT')
const validateJwt = mocked(ValidateJWT, true)

describe('create super episode controller', () => {
  validateJwt.mockImplementation(() => {
    return {
      validate: jest.fn().mockImplementation(req => {
        return {
          value: { ...req, decoded: 'decoded-jwt' } as any,
        }
      }),
    }
  })
  const generatedId = '1234334325249324328043280'
  const container = new Container()
  container
    .bind<Handler>(Locator.CreateSuperEpisodeController)
    .to(CreateSuperEpisodeController)
  const MockCreateSuperEpisodeUseCase = jest.fn().mockImplementation(() => {
    return {
      create: jest.fn().mockResolvedValueOnce({ id: generatedId }),
    }
  })
  const mockCreateSuperEpisodeUseCase = new MockCreateSuperEpisodeUseCase()
  container
    .bind<ICreateSuperEpisodeUseCase>(Locator.CreateSuperEpisodeUseCase)
    .toConstantValue(mockCreateSuperEpisodeUseCase)
  const createSuperEpisodeController = container.get<Handler>(
    Locator.CreateSuperEpisodeController,
  )
  it('should fails in validation because req body is invalid', async () => {
    await expect(
      createSuperEpisodeController.handle({
        cookies: { token: 'hdsua' },
      } as Request),
    ).rejects.toThrow('superepisode is missing in request body')
  })
  it('should proceed with usecase because body is valid', async () => {
    const superEpisode = { name: 'Feira Z', color: 'red' }
    const createdSuperEpisode = await createSuperEpisodeController.handle({
      cookies: { token: 'dsau' },
      body: { superEpisode },
    } as Request)
    expect(createdSuperEpisode.statusCode).toBe(201)
    expect(createdSuperEpisode.body.superEpisode).toMatchObject({
      id: generatedId,
    })
  })
})
