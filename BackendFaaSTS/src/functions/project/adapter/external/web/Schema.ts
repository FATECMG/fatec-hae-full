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
    notice: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        title: { type: 'string' }
      },
      required: ['id', 'title']
    },
    title: { type: 'string' },
    active: { type: 'boolean' },
    objectives: { type: 'string' },
    description: { type: 'string' },
    topicsOfInterest: { type: 'string[]' },
    methodology: { type: 'string' },
    justification: { type: 'string' },
    references: { type: 'string' },
    schedule: { type: 'string' },
    proposedHours: { type: 'string' },
    sendDate: { type: 'string' },
    complianceModel: { type: 'string' },
    status: { type: 'string' }
  },
  required: ['author', 'title', 'notice', 'objectives', 'description', 'topicsOfInterest', 'methodology', 'justification', 'references', 'schedule', 'hours', 'complianceModel', 'proposedHours', 'active']

} as const

export const ProjectPutSchema = {
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
    notice: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        title: { type: 'string' }
      },
      required: ['id', 'title']
    },
    title: { type: 'string' },
    active: { type: 'boolean' },
    objectives: { type: 'string' },
    description: { type: 'string' },
    topicsOfInterest: { type: 'string[]' },
    methodology: { type: 'string' },
    justification: { type: 'string' },
    references: { type: 'string' },
    schedule: { type: 'string' },
    hours: {
      type: 'object',
      properties: {
        proposed: { type: 'string' },
        approved: { type: 'string' }
      },
      required: ['proposed', 'approved']
    },
    sendDate: { type: 'string' },
    complianceModel: { type: 'string' },
    status: { type: 'string' }
  },
  required:
    ['author', 'title', 'notice',
      'objectives', 'description', 'topicsOfInterest',
      'methodology', 'justification', 'references',
      'schedule', 'complianceModel', 'hours',
      'active', 'status']

} as const

export const ProjectStatusUpdateSchema = {
  type: 'object',
  properties: {
    status: { type: 'string' }
  },
  required: ['status']
} as const
