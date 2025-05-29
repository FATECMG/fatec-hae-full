import { TransformerBuilder } from '@common/utils/transformer/TransformerBuilder'
import { EmojiParser } from '@common/utils/transformer/regex/emojiParser/EmojiParser'
import { StringTrimmer } from '@common/utils/transformer/stringTrimmer/StringTimmer'

describe('TransformerBuilder', () => {
  it('should return a StringTrimmer Transformer', () => {
    const systemUnderTest = TransformerBuilder.of().stringTrimmer().build()

    expect(systemUnderTest).toEqual([new StringTrimmer()])
  })

  it('should return a EmojiParser Transformer', () => {
    const systemUnderTest = TransformerBuilder.of().emojiParser().build()

    expect(systemUnderTest).toEqual([new EmojiParser()])
  })

  it('should return a EmojiParser and StringTrimmer Transformer', () => {
    const systemUnderTest = TransformerBuilder.of().emojiParser().stringTrimmer().build()

    expect(systemUnderTest).toEqual([new EmojiParser(), new StringTrimmer()])
  })
})
