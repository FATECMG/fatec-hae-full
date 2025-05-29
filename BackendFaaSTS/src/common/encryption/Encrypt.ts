/**
 * Interface that ensures that the encryption classes implementations have the necessary methods to encrypt a string.
 * @interface EncryptString
 */
export interface EncryptString {
  /**
   * Hashes a string.
   * @param {string} value - The string to hash.
   * @returns {string} The hashed string.
   */
  hashPassword: (value: string) => string
}

export interface CompareEncryptedString {
  comparePassword: (value: string, hashedValue: string) => boolean
}
