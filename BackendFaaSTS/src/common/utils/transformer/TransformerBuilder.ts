import { type DataTransformer } from '@common/utils/transformer/Interface'
import { getStringTrimmer } from '@common/utils/transformer/stringTrimmer/Factory'
import { getEmojiParser } from '@common/utils/transformer/regex/emojiParser/Factory'
import { getSpaceNormalizer } from '@common/utils/transformer/spaceNormalizer/Factory'
import { getUpperCase } from './upperCase/Factory'

/**
 * A builder class that allows the creation of a chain of data transformers.
 * @class
 */
export class TransformerBuilder {
  private readonly transformers: DataTransformer[] = []

  private constructor () {}

  /**
   * Creates a new instance of the `TransformerBuilder` class.
   * @static
   * @returns {TransformerBuilder} A new instance of the `TransformerBuilder` class.
   */
  static of (): TransformerBuilder {
    return new TransformerBuilder()
  }

  /**
   * Adds a string trimmer transformer to the chain.
   * @returns {TransformerBuilder} The current instance of the `TransformerBuilder` class.
   */
  stringTrimmer (): TransformerBuilder {
    this.transformers.push(getStringTrimmer())
    return this
  }

  /**
   * Adds a space normalizer transformer to the chain.
   * @returns {TransformerBuilder} The current instance of the `TransformerBuilder` class.
   */
  spaceNormalizer (): TransformerBuilder {
    this.transformers.push(getSpaceNormalizer())
    return this
  }

  /**
   * Adds an emoji parser transformer to the chain.
   * @returns {TransformerBuilder} The current instance of the `TransformerBuilder` class.
   */
  emojiParser (): TransformerBuilder {
    this.transformers.push(getEmojiParser())
    return this
  }

  /**
     *  Adds an upper case transformer to the chain.
     * @returns {TransformerBuilder} The current instance of the `TransformerBuilder` class.
     */
  upperCase (): TransformerBuilder {
    this.transformers.push(getUpperCase())
    return this
  }

  /**
   * Builds the chain of transformers.
   * @returns {DataTransformer[]} The list of transformers to be executed.
   */
  build (): DataTransformer[] {
    return this.transformers
  }
}
