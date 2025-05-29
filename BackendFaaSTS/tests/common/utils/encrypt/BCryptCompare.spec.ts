import 'reflect-metadata'

import { BCryptCompareEncryptedValues, BCryptEncrypt } from '@common/utils/encryption/BCryptEncryption'

describe('BCryptCompareEncryptedValues', () => {
  let systemUnderTest: BCryptCompareEncryptedValues
  let encryptService: BCryptEncrypt
  let hashedPassword: string

  beforeEach(() => {
    encryptService = new BCryptEncrypt()
    systemUnderTest = new BCryptCompareEncryptedValues()
    hashedPassword = 'any_hashed_password'
  })

  it('should return true if values match', () => {
    const result = systemUnderTest.comparePassword('any_hashed_password', encryptService.hashPassword(hashedPassword))

    expect(result).toBeTruthy()
  })

  it('should return false if values do not match', () => {
    const result = systemUnderTest.comparePassword('any_password', hashedPassword)

    expect(result).toBeFalsy()
  })
})
