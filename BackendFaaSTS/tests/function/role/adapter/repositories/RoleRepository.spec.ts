import 'reflect-metadata'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

import { RoleRepository } from '@functions/role/adapter/repositories/RoleMongoRepository'
import { RoleModel } from '@functions/role/adapter/repositories/model/RoleMongoModel'

jest.mock('@common/external/database/MongoDB')

describe('RoleRepository', () => {
  let mongoServer: MongoMemoryServer
  let roleRepository: RoleRepository

  beforeAll(async () => {
    roleRepository = new RoleRepository()
    mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri(), {})
  })

  afterEach(async () => {
    const collections = mongoose.connection.collections

    for (const key in collections) {
      const collection = collections[key]
      await collection.deleteMany()
    }
  })

  afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    await mongoServer.stop()
  })

  it('should calls RoleModel.find() with correct values', async () => {
    const findSpy = jest.spyOn(RoleModel, 'find')

    await roleRepository.findAll()

    expect(findSpy).toHaveBeenCalledWith({ active: true })
    expect(findSpy).toHaveBeenCalledTimes(1)
  })

  it('should return roles on success', async () => {
    await RoleModel.create({ id: 'any_id', name: 'any_name', active: true })

    const result = await roleRepository.findAll()

    expect(result).not.toBeUndefined()
    expect(result.length).toBeGreaterThanOrEqual(1)
  })
})
