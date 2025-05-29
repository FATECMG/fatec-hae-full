import { TemplateTransformer } from '@common/utils/transformer/TemplateTransformer'

/**
 * A class that extends the `TemplateTransformer` class and provides a template for normalizing spaces in a string.
 * @extends {TemplateTransformer}
 */
export class SpaceNormalizer extends TemplateTransformer {
  performTransformation (param: any): any {
    return param.replace(/\s+/g, ' ')
  }
}
