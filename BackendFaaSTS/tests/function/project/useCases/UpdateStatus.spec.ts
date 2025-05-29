import 'reflect-metadata'

import { mock, type MockProxy } from 'jest-mock-extended'

import { StatusNotUpdated, StatusNotValid, StatusNotValidChange } from '@common/error/StatusError'
import { IDNotFoundError } from '@common/error/NotFoundError'
import { type FindOneEntityRepository } from '@common/repository/RepositoryInterface'

import { type Project } from '@functions/project/entities/Project'
import { type UpdateStatusRepository } from '@functions/project/adapter/repositories/MongoDB/UpdateStatus'
import { UpdateProjectStatusUseCase } from '@functions/project/useCases/UpdateStatus'
import { Status } from '@functions/project/entities/enums/ProjectEnums'
import { RoleEnum } from '@functions/user/entities/User'
import { type Notice } from '@functions/notice/entities'

import { actualDate, anyRole, baseTestNotice, baseTestProject, pastDate, restrictedRole } from './testData'
import { InvalidRangeDate } from '@common/error/InvalidDate'

describe('Update Project Status UseCase', () => {
  let templateProject: Project
  let templateNotice: Notice
  let updateStatusRepo: MockProxy<UpdateStatusRepository>
  let findOneRepo: MockProxy<FindOneEntityRepository<Project>>
  let findOneNotice: MockProxy<FindOneEntityRepository<Notice>>
  let systemUnderTest: UpdateProjectStatusUseCase

  beforeAll(() => {
    templateNotice = baseTestNotice
    templateProject = baseTestProject
    updateStatusRepo = mock()
    updateStatusRepo.perform.mockResolvedValue(true)
    findOneRepo = mock()
    findOneRepo.perform.mockResolvedValue(templateProject)
    findOneNotice = mock()
    findOneNotice.perform.mockResolvedValue(templateNotice)

    systemUnderTest = new UpdateProjectStatusUseCase(updateStatusRepo, findOneRepo, findOneNotice)
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return a Project when UpdateStatusRepo returns true', async () => {
    const result = await systemUnderTest.execute({ id: 'any_id', status: Status.SENT, role: anyRole })

    expect(findOneRepo.perform).toHaveBeenCalledTimes(1)
    expect(findOneRepo.perform).toHaveBeenCalledWith('any_id')
    expect(updateStatusRepo.perform).toHaveBeenCalledTimes(1)
    expect(updateStatusRepo.perform).toHaveBeenCalledWith('any_id', Status.SENT, actualDate)
    expect(result).toEqual(templateProject)
  })

  it('should throw a StatusNotValid when an invalid status is sent', async () => {
    const result = systemUnderTest.execute({ id: 'any_id', status: 'any_invalid_status', role: anyRole })
    expect(result).resolves.toThrow(StatusNotValid)
  })

  it('should throws StatusNotUpdated when UpdateStatusRepo returns false', async () => {
    updateStatusRepo.perform.mockResolvedValue(false)
    findOneRepo.perform.mockResolvedValue({ ...templateProject, status: Status.DRAFT })
    const result = systemUnderTest.execute({ id: 'any_id', status: Status.SENT, role: anyRole })
    expect(result).resolves.toThrow(new StatusNotUpdated())
  })

  it('should throws IDNotFoundError when FindOneRepo returns undefined', async () => {
    findOneRepo.perform.mockResolvedValue(undefined)
    const result = systemUnderTest.execute({ id: 'any_id', status: Status.SENT, role: anyRole })
    expect(result).resolves.toThrow(new IDNotFoundError('any_id', 'Projeto'))
  })

  it('should throws StatusNotValidChange when the current status is SENT and new status is DRAFT when restricted role', async () => {
    templateProject.status = Status.SENT
    findOneRepo.perform.mockResolvedValue(templateProject)
    const result = systemUnderTest.execute({ id: 'any_id', status: Status.DRAFT, role: restrictedRole })
    expect(result).resolves.toThrow(StatusNotValidChange)
  })

  it('should throws StatusNotValidChange when the current status is SENT and new status is APPROVED when restricted role', async () => {
    templateProject.status = Status.SENT
    findOneRepo.perform.mockResolvedValue(templateProject)
    const result = systemUnderTest.execute({ id: 'any_id', status: Status.APPROVED, role: restrictedRole })
    expect(result).resolves.toThrow(StatusNotValidChange)
  })

  it('should throws StatusNotValidChange when the current status is SENT and new status is REJECTED when restricted role', async () => {
    templateProject.status = Status.SENT
    findOneRepo.perform.mockResolvedValue(templateProject)
    const result = systemUnderTest.execute({ id: 'any_id', status: Status.REJECTED, role: restrictedRole })
    expect(result).resolves.toThrow(StatusNotValidChange)
  })

  it('should throws StatusNotValidChange when the current status is APPROVED and new status is DRAFT when restricted role', async () => {
    templateProject.status = Status.APPROVED
    findOneRepo.perform.mockResolvedValue(templateProject)
    const result = systemUnderTest.execute({ id: 'any_id', status: Status.DRAFT, role: restrictedRole })
    expect(result).resolves.toThrow(StatusNotValidChange)
  })

  it('should throws StatusNotValidChange when the current status is APPROVED and new status is SENT when restricted role', async () => {
    templateProject.status = Status.APPROVED
    findOneRepo.perform.mockResolvedValue(templateProject)
    const result = systemUnderTest.execute({ id: 'any_id', status: Status.SENT, role: restrictedRole })
    expect(result).resolves.toThrow(StatusNotValidChange)
  })

  it('should throws StatusNotValidChange when the current status is REJECTED and new status is DRAFT when restricted role', async () => {
    templateProject.status = Status.REJECTED
    findOneRepo.perform.mockResolvedValue(templateProject)
    const result = systemUnderTest.execute({ id: 'any_id', status: Status.DRAFT, role: restrictedRole })
    expect(result).resolves.toThrow(StatusNotValidChange)
  })

  it('should throws StatusNotValidChange when the current status is REJECTED and new status is SENT when restricted role', async () => {
    templateProject.status = Status.REJECTED
    findOneRepo.perform.mockResolvedValue(templateProject)
    const result = systemUnderTest.execute({ id: 'any_id', status: Status.SENT, role: restrictedRole })
    expect(result).resolves.toThrow(StatusNotValidChange)
  })

  it('should change from APPROVED to RETURNED_FOR_CORRECTION when user role is COORDINATOR', async () => {
    templateProject.status = Status.APPROVED

    updateStatusRepo.perform.mockResolvedValue(true)

    findOneRepo.perform.mockResolvedValue(templateProject)

    const result = await systemUnderTest.execute({ id: 'any_id', status: Status.RETURNED_FOR_CORRECTION, role: RoleEnum.ADMINISTRATOR })

    expect(result).toStrictEqual({ ...templateProject, status: Status.RETURNED_FOR_CORRECTION })
  })

  it('should change from APPROVED to RETURNED_FOR_CORRECTION when user role is DIRECTOR', async () => {
    templateProject.status = Status.APPROVED

    updateStatusRepo.perform.mockResolvedValue(true)

    findOneRepo.perform.mockResolvedValue(templateProject)

    const result = await systemUnderTest.execute({ id: 'any_id', status: Status.RETURNED_FOR_CORRECTION, role: RoleEnum.DIRECTOR })

    expect(result).toStrictEqual({ ...templateProject, status: Status.RETURNED_FOR_CORRECTION })
  })

  it('should change from APPROVED to RETURNED_FOR_CORRECTION when user role is ACADEMIC DIRECTOR', async () => {
    templateProject.status = Status.APPROVED

    updateStatusRepo.perform.mockResolvedValue(true)

    findOneRepo.perform.mockResolvedValue(templateProject)

    const result = await systemUnderTest.execute({ id: 'any_id', status: Status.RETURNED_FOR_CORRECTION, role: RoleEnum.ACADEMICDIRECTOR })

    expect(result).toStrictEqual({ ...templateProject, status: Status.RETURNED_FOR_CORRECTION })
  })

  it('should change from APPROVED to UNDER_VALIDATION when user role is ADMINISTRATOR', async () => {
    templateProject.status = Status.APPROVED

    updateStatusRepo.perform.mockResolvedValue(true)

    findOneRepo.perform.mockResolvedValue(templateProject)

    const result = await systemUnderTest.execute({ id: 'any_id', status: Status.UNDER_VALIDATION, role: RoleEnum.ADMINISTRATOR })

    expect(result).toStrictEqual({ ...templateProject, status: Status.UNDER_VALIDATION })
  })

  it('should change from APPROVED to UNDER_VALIDATION when user role is DIRECTOR', async () => {
    templateProject.status = Status.APPROVED

    updateStatusRepo.perform.mockResolvedValue(true)

    findOneRepo.perform.mockResolvedValue(templateProject)

    const result = await systemUnderTest.execute({ id: 'any_id', status: Status.UNDER_VALIDATION, role: RoleEnum.DIRECTOR })

    expect(result).toStrictEqual({ ...templateProject, status: Status.UNDER_VALIDATION })
  })

  it('should change from APPROVED to UNDER_VALIDATION when user role is ACADEMIC DIRECTOR', async () => {
    templateProject.status = Status.APPROVED

    updateStatusRepo.perform.mockResolvedValue(true)

    findOneRepo.perform.mockResolvedValue(templateProject)

    const result = await systemUnderTest.execute({ id: 'any_id', status: Status.UNDER_VALIDATION, role: RoleEnum.ACADEMICDIRECTOR })

    expect(result).toStrictEqual({ ...templateProject, status: Status.UNDER_VALIDATION })
  })

  it('should change from APPROVED to REJECTED when user role is ADMINISTRATOR', async () => {
    templateProject.status = Status.APPROVED

    updateStatusRepo.perform.mockResolvedValue(true)

    findOneRepo.perform.mockResolvedValue(templateProject)

    const result = await systemUnderTest.execute({ id: 'any_id', status: Status.REJECTED, role: RoleEnum.ADMINISTRATOR })

    expect(result).toStrictEqual({ ...templateProject, status: Status.REJECTED })
  })

  it('should change from APPROVED to REJECTED when user role is DIRECTOR', async () => {
    templateProject.status = Status.APPROVED

    updateStatusRepo.perform.mockResolvedValue(true)

    findOneRepo.perform.mockResolvedValue(templateProject)

    const result = await systemUnderTest.execute({ id: 'any_id', status: Status.REJECTED, role: RoleEnum.DIRECTOR })

    expect(result).toStrictEqual({ ...templateProject, status: Status.REJECTED })
  })

  it('should change from APPROVED to REJECTED when user role is ACADEMIC DIRECTOR', async () => {
    templateProject.status = Status.APPROVED

    updateStatusRepo.perform.mockResolvedValue(true)

    findOneRepo.perform.mockResolvedValue(templateProject)

    const result = await systemUnderTest.execute({ id: 'any_id', status: Status.REJECTED, role: RoleEnum.DIRECTOR })

    expect(result).toStrictEqual({ ...templateProject, status: Status.REJECTED })
  })

  it('should change from REJECTED to RETURNED_FOR_CORRECTION when user role is COORDINATOR', async () => {
    templateProject.status = Status.REJECTED

    updateStatusRepo.perform.mockResolvedValue(true)

    findOneRepo.perform.mockResolvedValue(templateProject)

    const result = await systemUnderTest.execute({ id: 'any_id', status: Status.RETURNED_FOR_CORRECTION, role: RoleEnum.ADMINISTRATOR })

    expect(result).toStrictEqual({ ...templateProject, status: Status.RETURNED_FOR_CORRECTION })
  })

  it('should change from REJECTED to RETURNED_FOR_CORRECTION when user role is DIRECTOR', async () => {
    templateProject.status = Status.REJECTED

    updateStatusRepo.perform.mockResolvedValue(true)

    findOneRepo.perform.mockResolvedValue(templateProject)

    const result = await systemUnderTest.execute({ id: 'any_id', status: Status.RETURNED_FOR_CORRECTION, role: RoleEnum.DIRECTOR })

    expect(result).toStrictEqual({ ...templateProject, status: Status.RETURNED_FOR_CORRECTION })
  })

  it('should change from REJECTED to RETURNED_FOR_CORRECTION when user role is ACADEMIC DIRECTOR', async () => {
    templateProject.status = Status.REJECTED

    updateStatusRepo.perform.mockResolvedValue(true)

    findOneRepo.perform.mockResolvedValue(templateProject)

    const result = await systemUnderTest.execute({ id: 'any_id', status: Status.RETURNED_FOR_CORRECTION, role: RoleEnum.ACADEMICDIRECTOR })

    expect(result).toStrictEqual({ ...templateProject, status: Status.RETURNED_FOR_CORRECTION })
  })

  it('should throw InvalidRangeDate when user send project after the close date when restricted role', async () => {
    templateProject.status = Status.DRAFT
    templateNotice.closeDate = pastDate

    findOneRepo.perform.mockResolvedValue(templateProject)
    findOneNotice.perform.mockResolvedValue(templateNotice)
    const result = systemUnderTest.execute({ id: 'any_id', status: Status.SENT, role: restrictedRole })

    expect(result).resolves.toThrow(InvalidRangeDate)
  })

  it('should not throw InvalidRangeDate when user send project after the close date when user is Director', async () => {
    templateProject.status = Status.DRAFT
    templateNotice.closeDate = pastDate

    findOneRepo.perform.mockResolvedValue(templateProject)
    findOneNotice.perform.mockResolvedValue(templateNotice)
    const result = await systemUnderTest.execute({ id: 'any_id', status: Status.SENT, role: RoleEnum.DIRECTOR })

    expect(result).toEqual(templateProject)
  })
})
