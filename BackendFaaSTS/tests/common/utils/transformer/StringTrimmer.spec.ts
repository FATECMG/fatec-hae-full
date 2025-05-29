import { StringTrimmer } from '@common/utils/transformer/stringTrimmer/StringTimmer'

describe('StringTrimmer', () => {
  let systemUnderTest: StringTrimmer

  beforeAll(() => {
    systemUnderTest = new StringTrimmer()
  })

  it('should remove extra spaces from string', () => {
    const extraSpace = '     extraSpace            '

    const result = systemUnderTest.execute(extraSpace)

    expect(result).toBe('extraSpace')
  })

  it('should remove extra spaces from all strings inside an object', () => {
    const someObject = {
      first: '     extra            ',
      second: '     space            ',
      number: 20
    }

    const result = systemUnderTest.execute(someObject)

    expect(result).toEqual({
      first: 'extra',
      second: 'space',
      number: 20
    })
  })

  it('should remove extra spaces from all strings inside an array', () => {
    const someObject = ['    extra', 'space       ', '      extra space      ']

    const result = systemUnderTest.execute(someObject)

    expect(result).toEqual(['extra', 'space', 'extra space'])
  })

  it('should remove extra spaces from all strings inside an complex object', () => {
    const someObject = {
      first: '     extra            ',
      second: '     space            ',
      number: 20,
      complex: {
        value: 'any_value',
        array: ['   value     ', 'here', {
          inside: '   array     '
        }],
        someNumber: 50
      },
      someBool: true
    }

    const result = systemUnderTest.execute(someObject)

    expect(result).toEqual({
      first: 'extra',
      second: 'space',
      number: 20,
      complex: {
        value: 'any_value',
        array: ['value', 'here', {
          inside: 'array'
        }],
        someNumber: 50
      },
      someBool: true
    })
  })
})
