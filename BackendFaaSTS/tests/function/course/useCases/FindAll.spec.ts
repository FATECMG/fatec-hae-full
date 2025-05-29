import 'reflect-metadata'

import { type FindAllEntityRepository } from '@common/repository/RepositoryInterface'
import { type Course } from '@functions/course/entities/Course'
import { FindAllCoursesUseCase } from '@functions/course/useCases/FindAll'

import { mock, type MockProxy } from 'jest-mock-extended'

describe('FindAll', () => {
  let systemUnderTest: FindAllCoursesUseCase
  let courseRepository: MockProxy<FindAllEntityRepository<Course>>

  beforeAll(() => {
    courseRepository = mock()
    courseRepository.perform.mockResolvedValue([] as Course[])
    systemUnderTest = new FindAllCoursesUseCase(courseRepository)
  })

  it('should return all courses', async () => {
    const templateCourses: Course[] = [
      {
        id: 'any_id',
        name: 'any_name',
        acronym: 'any_acronym',
        active: true,
        code: 'any_code',
        coordinator: 'any_coordinator',
        schedule: ['any_schedule']
      }]
    courseRepository.perform.mockResolvedValueOnce(templateCourses)

    const courses = await systemUnderTest.execute(true)

    expect(courses).toHaveLength(1)
    expect(courses).toEqual(templateCourses)
  })

  it('should return an empty array if no course was found', async () => {
    const courses = await systemUnderTest.execute(true)

    expect(courses).toEqual([])
  })
})
