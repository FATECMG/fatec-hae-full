/**
 * Proposed scheme for standardizing a JSON body request for course resources.
 * The following properties are required:
 *  - name: string
 *  - active: boolean
 *  - code: string
 * - acronym: string
 * - schedule: string[]
 * - coordinator: string
 * Properties that are not required:
 * - id: string
 * - active: boolean
 */
export default {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    active: { type: 'boolean' },
    code: { type: 'string' },
    acronym: { type: 'string' },
    schedule: { type: 'string[]' },
    coordinator: { type: 'string' }
  },
  required: ['name', 'code', 'acronym', 'schedule', 'coordinator']
} as const
