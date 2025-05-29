import { type Mapper } from '@common/mapper/BaseMapper'

import { Project } from '@functions/project/entities/Project'
import { type ProjectDTO } from '@functions/project/entities/dto/ProjectDTO'
import { type ProjectUpdateDTO } from '@functions/project/entities/dto/ProjectUpdateDTO'
import { type ProjectPM } from '@functions/project/entities/pm/ProjectPM'

import { injectable } from 'inversify'

/**
 * A class that implements the `Mapper` interface to map `ProjectDTO` objects to `Project` entities.
 */
@injectable()
export class ProjectMapper implements Mapper<ProjectDTO, Project> {
  /**
   * Maps a `ProjectDTO` object to a `Project` entity.
   * @param {ProjectDTO} dto - The `ProjectDTO` object to map.
   * @returns {Promise<Project>} A `Promise` that resolves to a `Project` entity.
   */
  async execute (dto: ProjectDTO): Promise<Project> {
    const project = new Project({
      author: {
        id: dto.author.id,
        name: dto.author.name.toUpperCase()
      },
      notice: {
        id: dto.notice.id,
        title: dto.notice.title.toUpperCase()
      },
      title: dto.title.toUpperCase(),
      description: dto.description.toUpperCase(),
      objectives: dto.objectives.toUpperCase(),
      methodology: dto.methodology.toUpperCase(),
      justification: dto.justification.toUpperCase(),
      references: dto.references.toUpperCase(),
      topicsOfInterest: dto.topicsOfInterest.map(each => each.toUpperCase()),
      complianceModel: dto.complianceModel.toUpperCase(),
      schedule: dto.schedule.toUpperCase(),
      comments: [],
      active: dto.active,
      sendDate: dto.sendDate,
      hours: {
        proposed: dto.proposedHours
      }
    })
    return project
  }
}

/**
 * A class that implements the `Mapper` interface to map `Project` entities to `ProjectPM` presentation models.
 */
@injectable()
export class ProjectPresentationModelMapper implements Mapper<Project, ProjectPM> {
  /**
   * Maps a `Project` entity to a `ProjectPM` presentation model.
   * @param {Project} entity - The `Project` entity to map.
   * @returns {Promise<ProjectPM>} A `Promise` that resolves to a `ProjectPM` presentation model.
   */
  async execute (entity: Project): Promise<ProjectPM> {
    return {
      author: {
        id: entity.author.id,
        name: entity.author.name
      },
      notice: {
        id: entity.notice.id,
        title: entity.notice.title
      },
      id: entity.id,
      title: entity.title,
      description: entity.description,
      objectives: entity.objectives,
      methodology: entity.methodology,
      justification: entity.justification,
      references: entity.references,
      topicsOfInterest: entity.topicsOfInterest,
      complianceModel: entity.complianceModel,
      schedule: entity.schedule,
      comments: entity.comments,
      sendDate: entity.sendDate,
      hours: {
        approved: entity.hours.approved,
        proposed: entity.hours.proposed
      },
      status: entity.status,
      active: entity.active
    }
  }
}

/**
 * A class that implements the `Mapper` interface to map `ProjectUpdateDTO` objects to `Project` entities.
 */
@injectable()
export class ProjectUpdateMapper implements Mapper<ProjectUpdateDTO, Project> {
  /**
   * Maps a `ProjectUpdateDTO` object to a `Project` entity.
   * @param {ProjectUpdateDTO} dto - The `ProjectUpdateDTO` object to map.
   * @returns {Promise<Project>} A `Promise` that resolves to a `Project` entity.
   */
  async execute (dto: ProjectUpdateDTO): Promise<Project> {
    const project = new Project({
      author: {
        id: dto.author.id,
        name: dto.author.name.toUpperCase()
      },
      notice: {
        id: dto.notice.id,
        title: dto.notice.title.toUpperCase()
      },
      title: dto.title.toUpperCase(),
      description: dto.description.toUpperCase(),
      objectives: dto.objectives.toUpperCase(),
      methodology: dto.methodology.toUpperCase(),
      justification: dto.justification.toUpperCase(),
      references: dto.references.toUpperCase(),
      topicsOfInterest: dto.topicsOfInterest.map(each => each.toUpperCase()),
      complianceModel: dto.complianceModel.toUpperCase(),
      schedule: dto.schedule.toUpperCase(),
      comments: [],
      active: dto.active,
      status: dto.status,
      sendDate: dto.sendDate,
      hours: {
        proposed: dto.hours.proposed,
        approved: dto.hours.approved
      }
    })
    return project
  }
}
