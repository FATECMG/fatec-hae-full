import { Request } from 'express'
import { ValidationResult, ValidationSchema } from '../decorators/validate'
import { DomainError } from '../errors/domain.error'
import { getFirebase as admin } from '../firebase'
export class ValidateJWT implements ValidationSchema<Request> {
  async validate(
    req: Request,
  ): Promise<ValidationResult<Request & { decoded: any }>> {
    let error
    try {
      const cookies = req.cookies
      if (!cookies) {
        throw new DomainError({
          errorCode: 'jwt-001',
          message: 'cookies required',
        })
      }
      const { token } = cookies
      if (!token) {
        throw new DomainError({
          errorCode: 'jwt-002',
          message: 'no token provided',
        })
      }
      const decoded = await admin().auth().verifyIdToken(token, true)
      if (!decoded) {
        throw new DomainError({
          errorCode: 'jwt-003',
          message: 'decoding problem',
        })
      }
      return { value: { ...req, decoded: decoded } as any, error }
    } catch (err) {
      return {
        value: undefined,
        error: {
          message: err.message,
        },
      }
    }
  }
}
