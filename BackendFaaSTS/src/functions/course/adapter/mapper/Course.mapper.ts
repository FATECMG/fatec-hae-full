import { type Mapper } from '@common/mapper/BaseMapper'

import { Course } from '@functions/course/entities/Course'
import type { CourseDTO } from '@functions/course/entities/dto/CourseDTO'
import { type CoursePresentationModel } from '@functions/course/entities/dto/CoursePM'
import { type CourseNameAndIdPM } from '@functions/course/entities/pm/CourseNameAndIdPM'

import { injectable } from 'inversify'

/**
 * Implementation of the Mapper interface that maps a CourseDTO object to a Course object.
 */
@injectable()
export class CourseDTOMapper implements Mapper<CourseDTO, Course> {
  /**
     * Maps a CourseDTO object to a Course object.
     * @param dto - A CourseDTO object to be mapped.
     * @returns A Promise that resolves to a Course object with the mapped properties.
     */
  async execute (dto: CourseDTO): Promise<Course> {
    return new Course({
      name: dto.name.toUpperCase(),
      active: dto.active,
      code: dto.code.toUpperCase(),
      acronym: dto.acronym.toUpperCase(),
      schedule: dto.schedule,
      coordinator: dto.coordinator.toUpperCase()
    })
  }
}

/**
 * Implementation of the Mapper interface that maps a Course object to a CoursePresentationModel object.
 */
@injectable()
export class CourseMapperPresentationModel implements Mapper<Course, CoursePresentationModel> {
  /**
   * Maps a Course object to a CoursePresentationModel object.
   * @param entity - A Course object to be mapped.
   * @returns A Promise that resolves to a CoursePresentationModel object with the mapped properties.
   */
  async execute (entity: Course): Promise<CoursePresentationModel> {
    return {
      id: entity.id,
      name: entity.name,
      active: entity.active,
      code: entity.code,
      acronym: entity.acronym,
      schedule: entity.schedule,
      coordinator: entity.coordinator
    }
  }
}

/**
 * Implementation of the Mapper interface that maps a Course object to a CourseNameAndIdPM object.
 */
@injectable()
export class CourseNameAndIdMapperPM implements Mapper<Course, CourseNameAndIdPM> {
  /**
   * Maps a Course object to a CourseNameAndIdPM object.
   * @param entity - A Course object to be mapped.
   * @returns A Promise that resolves to a CourseNameAndIdPM object with the mapped properties.
   */
  async execute (entity: Course): Promise<CourseNameAndIdPM> {
    return {
      id: entity.id,
      name: entity.name
    }
  }
}
