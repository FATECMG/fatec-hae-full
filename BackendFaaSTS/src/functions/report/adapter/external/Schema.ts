export default {
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    activities: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          description: { type: 'string' }
        },
        required: ['description']
      }
    }
  },
  required: ['projectId', 'activities']
} as const

export const ReportStatusUpdateSchema = {
  type: 'object',
  properties: {
    status: { type: 'string' }
  },
  required: ['status']
} as const

export const ReportDeleteSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' }
  },
  required: ['id']
} as const