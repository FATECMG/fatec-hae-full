import 'reflect-metadata'
import { Container } from 'inversify'
import { Locator } from '../../shared/di.enums'
import { Handler } from '../../../../shared/adapters/controllers/interfaces'
import { CreateEpisodeController } from '../controllers/create.episode.controller'
import { IEpisodeUseCase } from '../../usecases/interface.usecase'

describe('episodes controller', () => {
  describe('create controller', () => {
    const controllerContainer = new Container()
    const MockedUseCase = jest.fn().mockImplementation(() => {
      return {
        create: jest.fn().mockImplementationOnce((episode = {}) => {
          return {
            ...episode,
            id: 'somevalidid',
          }
        }),
      }
    })
    const mockedUseCase = new MockedUseCase()
    controllerContainer
      .bind<Handler>(Locator.CreateEpisodeController)
      .to(CreateEpisodeController)
    controllerContainer
      .bind<IEpisodeUseCase>(Locator.EpisodeUseCase)
      .toConstantValue(mockedUseCase)
    const createEpisodeController = controllerContainer.get<Handler>(
      Locator.CreateEpisodeController,
    )
    it('should not create episode via controller cause it fails in validation', async () => {
      await expect(
        createEpisodeController.handle({ body: {} } as any),
      ).rejects.toThrow('missing episode in request body')
    })

    it('should create episode', async () => {
      const episode = {
        business: {
          id: 'somevalidid',
        },
      }
      const response = await createEpisodeController.handle({
        body: { episode },
      } as any)

      expect(response.statusCode).toBe(201)
      expect(response.body).toBeDefined()
      expect(response.body.id).toBe('somevalidid')
    })
  })
})
