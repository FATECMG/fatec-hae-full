import { Course } from '@functions/course/entities/Course'

describe('Course Entity', () => {
  it('should create a course with the correct properties', () => {
    const course = new Course({
      name: 'any_name',
      acronym: 'any_acronym',
      code: 'any_code',
      schedule: ['any_schedule'],
      coordinator: 'any_coordinator',
      active: true
    })

    expect(course).toEqual({
      id: course.id,
      name: 'any_name',
      acronym: 'any_acronym',
      code: 'any_code',
      schedule: ['any_schedule'],
      coordinator: 'any_coordinator',
      active: true
    })
  })

  it("should generate a random ID if it's not sent", () => {
    const course = new Course({
      name: 'any_name',
      acronym: 'any_acronym',
      code: 'any_code',
      schedule: ['any_schedule'],
      coordinator: 'any_coordinator',
      active: true
    })

    expect(course.id).toBeDefined()
  })

  it('should create a course with the correct properties and ID', () => {
    const course = new Course({
      name: 'any_name',
      acronym: 'any_acronym',
      code: 'any_code',
      schedule: ['any_schedule'],
      coordinator: 'any_coordinator',
      active: true
    }, 'any_id')

    expect(course).toEqual({
      id: 'any_id',
      name: 'any_name',
      acronym: 'any_acronym',
      code: 'any_code',
      schedule: ['any_schedule'],
      coordinator: 'any_coordinator',
      active: true
    })
  })

  it('should set the active property to true if it is not sent', () => {
    const course = new Course({
      name: 'any_name',
      acronym: 'any_acronym',
      code: 'any_code',
      schedule: ['any_schedule'],
      coordinator: 'any_coordinator'
    })

    expect(course.active).toBe(true)
  })
})
