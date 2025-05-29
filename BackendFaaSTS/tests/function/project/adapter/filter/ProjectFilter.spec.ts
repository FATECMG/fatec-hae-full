import 'reflect-metadata'

import { ProjectFilter } from '@functions/project/adapter/external/web/filter/ProjectFilter'
import { Status } from '@functions/project/entities/enums/ProjectEnums'

describe('Project Filter', () => {
  const defaultStatus = [
    Status.APPROVED.toString(),
    Status.REJECTED.toString(),
    Status.SENT.toString(),
    Status.UNDER_VALIDATION.toString(),
    Status.RETURNED_FOR_CORRECTION.toString()
  ]

  it('should return the filters provided', () => {
    const filters = ProjectFilter.create({ status: [Status.APPROVED.toString(), Status.SENT.toString()], active: false })
    expect(filters.status).toEqual([Status.APPROVED.toString(), Status.SENT.toString()])
    expect(filters.active).toEqual(false)
  })

  it('should return the default status when no status is provided', () => {
    const filters = ProjectFilter.create({ active: false })
    expect(filters.status).toEqual(defaultStatus)
    expect(filters.active).toEqual(false)
  })

  it('should return the only valid status when invalid status is provided', () => {
    const filters = ProjectFilter.create({ status: [Status.APPROVED.toString(), 'any_invalid_status'], active: true })
    expect(filters.status).toEqual([Status.APPROVED.toString()])
    expect(filters.active).toEqual(true)
  })
})
