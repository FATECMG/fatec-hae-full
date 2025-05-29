import 'reflect-metadata'

import { mock, type MockProxy } from 'jest-mock-extended'

import { type Mapper } from '@common/mapper/BaseMapper'
import { type FindAllUseCase } from '@common/domain/UseCase.interface'

import { School } from '@functions/school/entities/School'
import { type SchoolPM } from '@functions/school/entities/dto/SchoolPM'
import { FindAllSchoolController } from '@functions/school/controller/FindAllController'

describe('FindAllSchoolController', () => {
  let templateSchool: School
  let templatePresentation: SchoolPM
  let systemUnderTest: FindAllSchoolController
  let schoolUseCases: MockProxy<FindAllUseCase<School>>
  let entityToPresentationModelMapper: MockProxy<Mapper<School, SchoolPM>>

  beforeAll(() => {
    templateSchool = new School({
      name: 'any_name',
      address: {
        city: 'any_city',
        complement: 'any_complement',
        district: 'any_district',
        number: 'any_number',
        postCode: 'any_postCode',
        state: 'any_state',
        street: 'any_street'
      },
      active: true
    })
    templatePresentation = {
      id: 'any_id',
      name: 'any_name',
      address: {
        city: 'any_city',
        complement: 'any_complement',
        district: 'any_district',
        number: 'any_number',
        postCode: 'any_postCode',
        state: 'any_state',
        street: 'any_street'
      },
      active: true
    }
    entityToPresentationModelMapper = mock()
    entityToPresentationModelMapper.execute.mockResolvedValue(templatePresentation)
    schoolUseCases = mock()
    schoolUseCases.execute.mockResolvedValue([templateSchool])
    systemUnderTest = new FindAllSchoolController(entityToPresentationModelMapper, schoolUseCases)
  })

  it('should return 200 on useCases success', async () => {
    const result = await systemUnderTest.handle(true)

    expect(result).toEqual({ statusCode: 200, data: [templatePresentation] })
    expect(schoolUseCases.execute).toHaveBeenCalledTimes(1)
  })
})
