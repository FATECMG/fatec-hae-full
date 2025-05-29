export default {
  type: 'object',
  properties: {
    resourceId: { type: 'string' },
    resourceType: { type: 'string' }
  },

  required: ['resourceId', 'resourceType']
} as const
