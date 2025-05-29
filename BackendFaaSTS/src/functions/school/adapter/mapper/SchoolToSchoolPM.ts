import { type Mapper } from '@common/mapper/BaseMapper'

import { SchoolPM } from '@functions/school/entities/dto/SchoolPM'
import { type School } from '@functions/school/entities/School'

import { injectable } from 'inversify'

/**
 * A mapper class that maps a School entity to a SchoolPM DTO object.
 * Implements the Mapper interface.
 */
@injectable()
export default class SchoolToSchoolPM implements Mapper<School, SchoolPM> {
  /**
   * Executes the mapping logic for a School entity to a SchoolPM DTO object.
   * @param entity - The School entity to map.
   * @returns A Promise that resolves to a SchoolPM DTO object.
   */
  async execute (entity: School): Promise<SchoolPM> {
    return new SchoolPM({ id: entity.id, name: entity.name, address: entity.address, active: entity.active })
  }
}
