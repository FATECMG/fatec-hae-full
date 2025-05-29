import { TemplateTransformer } from '@common/utils/transformer/TemplateTransformer'

/**
 * An abstract class that extends the `TemplateTransformer` class and provides a template for regex-based data transformation.
 * @abstract
 * @extends {TemplateTransformer}
 */
export abstract class BaseRegexTransformer extends TemplateTransformer {
  /**
   * Creates a new instance of the `BaseRegexTransformer` class.
   * @param {RegExp} regex - The regular expression to use for data transformation.
   */
  constructor (private readonly regex: RegExp) {
    super()
  }

  performTransformation (param: any): any {
    return param.replace(this.regex, '')
  }
}
