import 'reflect-metadata'

import { CourseDTOMapper } from '@functions/course/adapter/mapper/Course.mapper'
import { Course } from '@functions/course/entities/Course'
import { type CourseDTO } from '@functions/course/entities/dto/CourseDTO'

describe('CourseDTOMapper', () => {
  let systemUnderTest: CourseDTOMapper
  let baseCourse: CourseDTO

  beforeAll(() => {
    systemUnderTest = new CourseDTOMapper()

    baseCourse = {
      name: 'any_name',
      acronym: 'any_acronym',
      code: 'any_code',
      coordinator: 'any_coordinator',
      schedule: ['Noturno'],
      active: true
    }
  })

  it('should return a Course object with the mapped properties', async () => {
    const result = await systemUnderTest.execute(baseCourse)

    expect(result).toEqual(new Course({
      name: baseCourse.name.toUpperCase(),
      active: baseCourse.active,
      code: baseCourse.code.toUpperCase(),
      acronym: baseCourse.acronym.toUpperCase(),
      schedule: baseCourse.schedule,
      coordinator: baseCourse.coordinator.toUpperCase()
    }, result.id))
    expect(result).toBeInstanceOf(Course)
    expect(result).toHaveProperty('id')
  })
})
