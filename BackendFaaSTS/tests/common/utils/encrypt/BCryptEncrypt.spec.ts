import 'reflect-metadata'

import { genSaltSync, hashSync } from 'bcryptjs'

import { BCryptEncrypt } from '@common/utils/encryption/BCryptEncryption'

jest.mock('bcryptjs', () => ({
  genSaltSync: jest.fn().mockReturnValue('any_salt'),
  hashSync: jest.fn().mockReturnValue('any_hash')
}))

describe('BCryptEncrypt', () => {
  let systemUnderTest: BCryptEncrypt
  let password: string

  beforeAll(() => {
    systemUnderTest = new BCryptEncrypt()
    password = 'any_password'
  })

  it('should call encryption function with correct params', () => {
    systemUnderTest.hashPassword(password)

    expect(genSaltSync).toHaveBeenCalledWith(10)
    expect(genSaltSync).toHaveBeenCalledTimes(1)
    expect(hashSync).toHaveBeenCalledWith(password, 'any_salt')
    expect(hashSync).toHaveBeenCalledTimes(1)
  })

  it('should return a hash on success', () => {
    const hash = systemUnderTest.hashPassword(password)

    expect(hash).toBe('any_hash')
    expect(hash).not.toBe(password)
  })
})
