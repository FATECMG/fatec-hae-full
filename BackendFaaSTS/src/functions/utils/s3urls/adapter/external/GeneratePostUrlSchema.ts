export default {
  type: 'object',
  properties: {
    files: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          type: { type: 'string' }
        },
        required: ['name', 'type']
      }
    },
    resourceId: { type: 'string' },
    resourceType: { type: 'string' }
  },

  required: ['files', 'resourceType', 'resourceId']
} as const
