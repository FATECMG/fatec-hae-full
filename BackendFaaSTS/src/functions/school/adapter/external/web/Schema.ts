/**
 * @object SchoolSchema
 * Proposed scheme for standardizing a JSON body request for school resources.
 */
export default {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    active: { type: 'boolean' },
    address: {
      type: 'object',
      properties: {
        postCode: { type: 'string' },
        street: { type: 'string' },
        number: { type: 'string' },
        complement: { type: 'string' },
        city: { type: 'string' },
        district: { type: 'string' },
        state: { type: 'string' }
      },
      required: ['street', 'city', 'district', 'postCode', 'number', 'complement', 'state']
    }
  },
  required: ['name', 'address']
} as const
