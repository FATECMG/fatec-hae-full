import 'reflect-metadata'
import { Container } from 'inversify'
import { IEpisodeRepository } from '../../adapters/repositories/interfaces.repository'
import { IEpisodeUseCase } from '../../usecases/interface.usecase'
import { EpisodeUseCase } from '../../usecases/episode.usecase'
import { Locator } from '../../shared/di.enums'
import { IEpisode } from '../../entities/interfaces'
import { Error } from 'mongoose'

jest.mock('../validations/validate.episode.usecase', () => {
  return {
    ValidateEpisodeUseCase: jest.fn().mockImplementation(() => {
      return {
        validate: jest
          .fn()
          .mockImplementationOnce(async (epi: IEpisode) => {
            return { value: epi }
          })
          .mockImplementationOnce(async () => {
            throw new Error('"name" must be a string')
          })
          .mockImplementationOnce(async (epi: IEpisode) => {
            return { value: epi }
          }),
      }
    }),
  }
})

describe('episode usecases', () => {
  const container = new Container()

  const MockRepository = jest.fn().mockImplementation(() => ({
    create: jest
      .fn()
      .mockResolvedValueOnce({ id: '1234' })
      .mockImplementationOnce(async () => {
        throw new Error('Não conseguimos criar o evento.')
      }),
  }))
  const mockRepository = new MockRepository()
  container
    .bind<IEpisodeRepository>(Locator.EpisodeRepository)
    .toConstantValue(mockRepository)
  container.bind<IEpisodeUseCase>(Locator.EpisodeUseCase).to(EpisodeUseCase)

  const usecase = container.get<IEpisodeUseCase>(Locator.EpisodeUseCase)
  it('should create a new episode successfully', async () => {
    const episode = {
      business: {
        id: 'somevalidid',
      },
    }
    const createdEpisode = await usecase.create(episode)

    expect(createdEpisode.id).toBe('1234')
  })

  it('should not create a new episode cause it fails in validation', async () => {
    const episode = {
      name: 1234, //name could not be number
    }
    await expect(usecase.create(episode as any)).rejects.toThrow(
      '"name" must be a string',
    )
  })

  it('should not create a new episode because there are errors in db', async () => {
    const episode = {
      business: {
        id: 'somevalidid',
      },
    }
    await expect(usecase.create(episode as any)).rejects.toThrow(
      'Não conseguimos criar o evento.',
    )
  })
})
