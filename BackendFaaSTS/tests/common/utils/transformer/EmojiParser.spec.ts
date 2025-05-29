import { EmojiParser } from '@common/utils/transformer/regex/emojiParser/EmojiParser'

describe('EmojiParser', () => {
  let systemUnderTest: EmojiParser

  beforeAll(() => {
    systemUnderTest = new EmojiParser()
  })

  it('should replace emojis with blank spaces', () => {
    const result = systemUnderTest.execute('😀')

    expect(result).toBe('')
  })

  it('should replace emojis with spaces inside arrays', () => {
    const result = systemUnderTest.execute(['😀😀', 'no-emoji-there', '😀hello'])

    expect(result).toEqual(['', 'no-emoji-there', 'hello'])
  })

  it('should replace emojis with spaces inside objects', () => {
    const result = systemUnderTest.execute({
      first: '😀😀',
      second: 'no-emoji-there',
      third: '😀hello'
    })

    expect(result).toEqual({
      first: '',
      second: 'no-emoji-there',
      third: 'hello'
    })
  })

  it('should not change value if its not a string', () => {
    const result = systemUnderTest.execute({
      number: 12,
      boolean: true,
      string: 'something with emoji here😀'
    })

    expect(result).toEqual({
      number: 12,
      boolean: true,
      string: 'something with emoji here'
    })
  })

  it('should be able to transform values inside a complex object', () => {
    const result = systemUnderTest.execute({
      first: '😀😀',
      second: 'no-emoji-there',
      third: '😀hello',
      fourth: {
        first: '😀😀',
        second: 'no-emoji-there',
        third: '😀hello'
      },
      fifth: ['some-value', '😀😀', '😀😀']
    })

    expect(result).toEqual({
      first: '',
      second: 'no-emoji-there',
      third: 'hello',
      fourth: {
        first: '',
        second: 'no-emoji-there',
        third: 'hello'
      },
      fifth: ['some-value', '', '']
    })
  })
})
