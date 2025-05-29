import { compareSync, genSaltSync, hashSync } from 'bcryptjs'

import { type CompareEncryptedString, type EncryptString } from '@common/encryption/Encrypt'

import { injectable } from 'inversify'

@injectable()
export class BCryptEncrypt implements EncryptString {
  /**
   * Hashes a password using the BCrypt algorithm.
   * @param {string} password - The password to hash.
   * @returns {string} The hashed password.
   */
  hashPassword (password: string): string {
    const salt = genSaltSync(10)
    return hashSync(password, salt)
  }
}

@injectable()
export class BCryptCompareEncryptedValues implements CompareEncryptedString {
  comparePassword (value: string, hashedValue: string): boolean {
    return compareSync(value, hashedValue)
  }
}
