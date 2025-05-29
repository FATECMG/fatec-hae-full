export default {
  type: 'object',
  properties: {
    from: { type: 'string' },
    to: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          address: { type: 'string' }
        },
        required: ['name', 'address']
      }
    },
    subject: { type: 'string' },
    body: { type: 'string' },
    cc: { type: 'string[]' },
    bcc: { type: 'string[]' }
  },
  required: ['from', 'to', 'subject', 'body']
} as const
