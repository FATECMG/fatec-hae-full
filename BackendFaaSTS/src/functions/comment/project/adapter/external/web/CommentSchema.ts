export default {
  type: 'object',
  properties: {
    author: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' }
      },
      required: ['id', 'name']
    },
    content: { type: 'string' }
  },
  required: ['author', 'content']
} as const
