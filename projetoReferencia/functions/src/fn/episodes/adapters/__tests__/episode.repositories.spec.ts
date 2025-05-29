import 'reflect-metadata'
import { IEpisode } from '../../entities/interfaces'
import { Locator } from '../../shared/di.enums'
import { IEpisodeRepository } from '../repositories/interfaces.repository'
import { EpisodeRepository } from '../repositories/episode.repository'
import { warmConnections } from '../../../../index'
import { model } from 'mongoose'
import { mocked } from 'ts-jest/utils'
import { Container } from 'inversify'

jest.mock('mongoose')
const mockedModel = mocked(model, true)
const createMock = jest
  .fn()
  .mockRejectedValueOnce('some errorsssss')
  .mockResolvedValueOnce({ id: '1234' })
mockedModel.mockImplementation(() => {
  return {
    create: createMock,
  } as any
})
jest.mock('../../../../index')
const mockedWarmConnections = mocked(warmConnections, false)
mockedWarmConnections.mockResolvedValueOnce()

describe('episode repositories', () => {
  const container = new Container()
  container
    .bind<IEpisodeRepository>(Locator.EpisodeRepository)
    .to(EpisodeRepository)
  const episodeRepository = container.get<IEpisodeRepository>(
    Locator.EpisodeRepository,
  )
  it('should not create an episode because there are errors in mongo connection', async () => {
    await expect(episodeRepository.create({} as IEpisode)).rejects.toThrow(
      'Não conseguimos criar o evento',
    )
    expect(createMock).toHaveBeenCalledTimes(1)
  })

  it('should create an complete episode with default values', async () => {
    const createdEpisode = await episodeRepository.create({} as IEpisode)
    expect(createdEpisode.id).toBe('1234')
  })
})
