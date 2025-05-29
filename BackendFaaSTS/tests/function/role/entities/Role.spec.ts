import { Role } from '@functions/role/entities/Role'

describe('Role', () => {
  it('should return correct attributes when its sent', () => {
    const systemUnderTest = new Role({ name: 'any_role', active: false }, 'any_id')

    expect(systemUnderTest.active).toBe(false)
    expect(systemUnderTest.name).toBe('any_role')
    expect(systemUnderTest.id).toBe('any_id')
  })

  it('should generate an id when its not sent', () => {
    const systemUnderTest = new Role({ name: 'any_role' })

    expect(systemUnderTest.id).not.toBeNull()
    expect(systemUnderTest.id).not.toBeUndefined()
  })

  it('should set active to true if its not sent', () => {
    const systemUnderTest = new Role({ name: 'any_role' })

    expect(systemUnderTest.active).toBe(true)
  })
})
