/**
 * @object UserSchema
 * Proposed scheme for standardizing a JSON body request for user resources.
 */
export default {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    email: { type: 'string' },
    password: { type: 'string' },
    phone: { type: 'string' },
    roles: { type: 'string' },
    courses: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' }
        },
        required: ['id', 'name']
      }
    },
    registerNumber: { type: 'string' },
    active: { type: 'boolean' },
    academicTitle: { type: 'string' }
  },
  required: ['name', 'email', 'roles', 'registerNumber', 'password', 'academicTitle', 'phone']

} as const

/**
 * @object UserPutSchema
 * Proposed schema for standardizing a JSON body request for user resources.
 * **ONLY FOR PUT METHOD**
 */
export const UserPutSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    email: { type: 'string' },
    phone: { type: 'string' },
    courses: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' }
        },
        required: ['id', 'name']
      }
    },
    roles: { type: 'string' },
    registerNumber: { type: 'string' },
    active: { type: 'boolean' },
    academicTitle: { type: 'string' }
  },
  required: ['name', 'email', 'roles', 'registerNumber', 'academicTitle', 'phone']

} as const
