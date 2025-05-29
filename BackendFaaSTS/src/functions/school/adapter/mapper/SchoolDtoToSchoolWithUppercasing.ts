import { type Mapper } from '@common/mapper/BaseMapper'
import { School } from '@functions/school/entities/School'

import { type SchoolDTO } from '@functions/school/entities/dto/SchoolDTO'

import { injectable } from 'inversify'

/**
 * A mapper class that maps a SchoolDTO object to a School object with all string properties in uppercase.
 * Implements the Mapper interface.
 */
@injectable()
export default class SchoolDtoToSchoolWithUppercasing implements Mapper<SchoolDTO, School> {
  /**
   * Executes the mapping logic for a SchoolDTO object to a School object with all string properties in uppercase.
   * @param dto - The SchoolDTO object to map.
   * @returns A Promise that resolves to a School object with all string properties in uppercase.
   */
  async execute (dto: SchoolDTO): Promise<School> {
    return new School({
      name: dto.name.toUpperCase(),
      active: dto.active,
      address: {
        postCode: dto.address.postCode,
        city: dto.address.city.toUpperCase(),
        street: dto.address.street.toUpperCase(),
        district: dto.address.district.toUpperCase(),
        state: dto.address.state.toUpperCase(),
        complement: dto.address.complement?.toUpperCase() ?? undefined,
        number: dto.address.number?.toUpperCase() ?? undefined
      }
    })
  }
}
