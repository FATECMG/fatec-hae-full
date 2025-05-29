import 'reflect-metadata'
import { Container } from 'inversify'
import { Locator } from '../../shared/di.enums'
import { ICreateSuperEpisodeUseCase } from '../interfaces.superepisode.usecase'
import { CreateSuperEpisodeUseCase } from '../create.superepisode.usecase'
import { Error } from 'mongoose'
import { ISuperEpisode } from '../../entities/interfaces'
import { ISuperEpisodeRepository } from '../../adapters/repositories/interfaces.repositories'

describe('create superepisode usecase', () => {
  const generatedId = '123456789101112'
  const container = new Container()
  container
    .bind<ICreateSuperEpisodeUseCase>(Locator.CreateSuperEpisodeUseCase)
    .to(CreateSuperEpisodeUseCase)
  const MockSuperEpisodeRepository = jest.fn().mockImplementation(() => {
    return {
      create: jest.fn().mockResolvedValueOnce({ id: generatedId }),
    }
  })
  const mockSuperEpisodeRepository = new MockSuperEpisodeRepository()
  container
    .bind<ISuperEpisodeRepository>(Locator.CreateSuperEpisodeMongo)
    .toConstantValue(mockSuperEpisodeRepository)
  const createSuperEpisodeUseCase = container.get<ICreateSuperEpisodeUseCase>(
    Locator.CreateSuperEpisodeUseCase,
  )
  it('should not proceed with creating because it fails in validation', async () => {
    try {
      await createSuperEpisodeUseCase.create({})
      throw new Error('never reaches here')
    } catch (err) {
      expect(err.message).toBe('"name" is required')
    }
  })
  it('should proceed creating superepisode because it passes validation', async () => {
    const superEpisode: ISuperEpisode = {
      name: 'Feira X',
      description: 'Uma feira de x-man',
      color: '#5d3d91',
    }
    const createdSuperEpisode = await createSuperEpisodeUseCase.create(
      superEpisode,
    )
    expect(createdSuperEpisode).toMatchObject({ id: generatedId })
    expect(createdSuperEpisode.id).toBe(generatedId)
  })
})
