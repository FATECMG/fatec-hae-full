/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-var-requires */

import { BaseRegexTransformer } from '@common/utils/transformer/regex/BaseRegex'

const emojiRegex = require('emoji-regex')

/**
 * A class that extends the `BaseRegexTransformer` class and provides a template for parsing emojis from a string.
 * @extends {BaseRegexTransformer}
 */
export class EmojiParser extends BaseRegexTransformer {
  constructor () {
    super(emojiRegex())
  }
}
