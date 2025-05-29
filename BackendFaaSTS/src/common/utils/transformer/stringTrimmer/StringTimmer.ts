import { TemplateTransformer } from '@common/utils/transformer/TemplateTransformer'

/**
 * A class that extends the `TemplateTransformer` class and provides a template for trimming whitespace from a string.
 * @extends {TemplateTransformer}
 */
export class StringTrimmer extends TemplateTransformer {
  performTransformation (param: any): any {
    return param.trim()
  }
}
