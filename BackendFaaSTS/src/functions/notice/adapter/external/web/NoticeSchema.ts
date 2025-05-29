export default {
  type: 'object',
  properties: {
    title: { type: 'string' },
    active: { type: 'boolean' },
    year: { type: 'string' },
    description: { type: 'string' },
    openDate: { type: 'string' },
    closeDate: { type: 'string' },
    evaluationEndDate: { type: 'string' },
    topicsOfInterest: { type: 'string[]' },
    semester: { type: 'string' },
    course: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' }
      }
    }
  },
  required: ['title', 'openDate', 'closeDate', 'year', 'topicsOfInterest', 'semester', 'description', 'evaluationEndDate']
} as const
