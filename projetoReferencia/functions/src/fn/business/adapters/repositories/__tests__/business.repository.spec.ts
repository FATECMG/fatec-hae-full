import { BusinessRepository } from '../business.repository'
import { model } from 'mongoose'
import { mocked } from 'ts-jest/utils'
import { warmConnections } from '../../../../..'

jest.mock('mongoose')
const mockedModel = mocked(model, true)
jest.mock('../../../../..')
const mockedWarmConnections = mocked(warmConnections, true)

describe('business repository', () => {
  mockedWarmConnections.mockResolvedValue()
  it('should save a new business to mongodb', async () => {
    mockedModel.mockImplementation(() => {
      return {
        create: async () => {
          return { _id: 'someid', id: 'someid' }
        },
      } as any
    })
    const businessRepository = new BusinessRepository()
    const createdBusiness = await businessRepository.create({
      name: 'Zelpay Business',
    })
    expect(createdBusiness).toBeDefined()
    expect(createdBusiness.id).toBe('someid')
  })
  it('should check if admin exists', async () => {
    mockedModel.mockImplementation(() => {
      return {
        findOne: async () => Promise.resolve({ id: 'adminid' }),
      } as any
    })
    const businessRepository = new BusinessRepository()
    const admin = await businessRepository.checkAdminExists('some')
    expect(admin).toBeDefined()
    expect(admin.id).toBe('adminid')
  })

  it('should list 2 users from a list of 10 users', async () => {
    mockedModel.mockImplementation(() => {
      return {
        find: jest.fn().mockImplementation(() => {
          return {
            limit: jest.fn().mockImplementation(() => {
              return {
                skip: jest.fn().mockImplementation(() => {
                  return {
                    exec: jest
                      .fn()
                      .mockResolvedValue([{ id: '1234' }, { id: '4321' }]),
                  }
                }),
              }
            }),
          }
        }),
        countDocuments: jest.fn().mockResolvedValue(10),
      } as any
    })
    const businessRepository = new BusinessRepository()
    const result = await businessRepository.list(undefined, undefined, 2, 0)
    expect(result.hasMore).toBeTruthy()
    expect(result.list).toHaveLength(2)
    expect(result.total).toBe(10)
  })
})
