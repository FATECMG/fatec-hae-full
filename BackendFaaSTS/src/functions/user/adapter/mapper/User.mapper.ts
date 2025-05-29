import { type Mapper } from '@common/mapper/BaseMapper'

import { type UserDTO } from '@functions/user/entities/dto/UserDTO'
import { User, type UserNameAndId } from '@functions/user/entities/User'
import { type UserNameAndIdPresentationModel, type UserPresentationModel } from '@functions/user/entities/dto/UserPM'
import { type UserUpdateDTO } from '@functions/user/entities/dto/UserUpdateDTO'

import { injectable } from 'inversify'
import { UserUpdate } from '@functions/user/entities/UserUpdate'

/**
 * Implementation of the Mapper interface that maps a User object to a UserDTO object.
 */
@injectable()
export class UserMapper implements Mapper<UserDTO, User> {
  /**
   * Maps a User object to a UserDTO object.
   * @param entity - A User object to be mapped.
   * @returns A Promise that resolves to a UserDTO object with the mapped properties.
   */
  async execute (dto: UserDTO): Promise<User> {
    return new User({
      name: dto.name.toUpperCase(),
      roles: dto.roles.toUpperCase(),
      active: dto.active,
      email: dto.email.toUpperCase(),
      courses: dto.courses.map(course => ({ id: course.id, name: course.name.toUpperCase() })),
      registerNumber: dto.registerNumber,
      phone: dto.phone,
      password: dto.password,
      academicTitle: dto.academicTitle.toUpperCase()
    })
  }
}

/**
 * Implementation of the Mapper interface that maps a User object to a UserPresentationModel object.
 */
@injectable()
export class UserMapperPresentationModel implements Mapper<User, UserPresentationModel> {
  /**
   * Maps a User object to a UserPresentationModel object.
   * @param entity - A User object to be mapped.
   * @returns A Promise that resolves to a UserPresentationModel object with the mapped properties.
   */
  async execute (entity: User): Promise<UserPresentationModel> {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      active: entity.active,
      phone: entity.phone,
      courses: entity.courses,
      registerNumber: entity.registerNumber,
      roles: entity.roles,
      academicTitle: entity.academicTitle
    }
  }
}

@injectable()
export class UserUpdateMapperPresentationModel implements Mapper<UserUpdate, UserPresentationModel> {
  /**
   * Maps a User object to a UserPresentationModel object.
   * @param entity - A UpdateUser object to be mapped.
   * @returns A Promise that resolves to a UserPresentationModel object with the mapped properties.
   */
  async execute (entity: UserUpdate): Promise<UserPresentationModel> {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      active: entity.active,
      phone: entity.phone,
      courses: entity.courses,
      registerNumber: entity.registerNumber,
      roles: entity.roles,
      academicTitle: entity.academicTitle
    }
  }
}

/**
 * Implementation of the Mapper interface that maps a UserUpdateDTO object to a User object.
 */
@injectable()
export class UserUpdateMapper implements Mapper<UserUpdateDTO, UserUpdate> {
  /**
   * Maps a UserUpdateDTO object to a User object.
   * @param dto - A UserUpdateDTO object to be mapped.
   * @returns A Promise that resolves to a User object with the mapped properties.
   */
  async execute (dto: UserUpdateDTO): Promise<UserUpdate> {
    return new UserUpdate({
      name: dto.name.toUpperCase(),
      roles: dto.roles.toUpperCase(),
      active: dto.active,
      email: dto.email.toUpperCase(),
      courses: dto.courses.map(course => ({ id: course.id, name: course.name.toUpperCase() })),
      registerNumber: dto.registerNumber,
      phone: dto.phone,
      academicTitle: dto.academicTitle.toUpperCase()
    })
  }
}

@injectable()
export class UserMapperNameAndIdPresentationModel implements Mapper<User, UserNameAndIdPresentationModel> {
  /**
   * Maps a User object to a UserNameAndIdPresentationModel object.
   * @param entity - A User object to be mapped.
   * @returns A Promise that resolves to a UserNameAndIdPresentationModel object with the mapped properties.
   */
  async execute (entity: UserNameAndId): Promise<UserNameAndIdPresentationModel> {
    return {
      id: entity.id,
      name: entity.name
    }
  }
}
