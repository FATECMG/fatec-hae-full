import { UserDTO } from '@functions/user/entities/dto/UserDTO'

describe('UserDTO', () => {
  it('should set active to true if its not passed', () => {
    const user = new UserDTO({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
      roles: 'any_role',
      courses: [
        {
          id: 'any_id',
          name: 'any_name'
        }
      ],
      academicTitle: 'GRADUADO',
      phone: 'any_phone',
      registerNumber: 'any_registerNumber'
    })

    expect(user.active).toBe(true)
  })

  it('should set active to false if its passed', () => {
    const user = new UserDTO({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
      roles: 'any_role',
      courses: [
        {
          id: 'any_id',
          name: 'any_name'
        }
      ],
      academicTitle: 'GRADUADO',
      phone: 'any_phone',
      registerNumber: 'any_registerNumber',
      active: false
    })

    expect(user.active).toBe(false)
  })

  it('should set active to true if its passed', () => {
    const user = new UserDTO({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
      roles: 'any_role',
      courses: [
        {
          id: 'any_id',
          name: 'any_name'
        }
      ],
      academicTitle: 'GRADUADO',
      phone: 'any_phone',
      registerNumber: 'any_registerNumber',
      active: true
    })

    expect(user.active).toBe(true)
  })
})
