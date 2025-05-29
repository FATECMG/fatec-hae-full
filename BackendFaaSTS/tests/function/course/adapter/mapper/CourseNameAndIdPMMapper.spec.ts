import 'reflect-metadata'

import { CourseNameAndIdMapperPM } from '@functions/course/adapter/mapper/Course.mapper'
import { Course } from '@functions/course/entities/Course'

describe('CourseNameAndIdMapperPM', () => {
  let systemUnderTest: CourseNameAndIdMapperPM
  let course: Course

  it('should map a Course object to a CourseNameAndIdPM object', async () => {
    systemUnderTest = new CourseNameAndIdMapperPM()
    course = new Course({
      name: 'Course Name',
      active: true,
      code: 'CODE',
      acronym: 'ACR',
      schedule: ['any_schedule', 'any_schedule'],
      coordinator: 'Coordinator'
    })

    const result = await systemUnderTest.execute(course)

    expect(result).toEqual({
      id: course.id,
      name: course.name
    })
  })
})
