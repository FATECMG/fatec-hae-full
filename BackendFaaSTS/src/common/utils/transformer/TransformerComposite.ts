import { type DataTransformer } from '@common/utils/transformer/Interface'

/**
 * A class that implements the `DataTransformer` interface and provides a composite of data transformers.
 * @implements {DataTransformer}
 */
export class TransformerComposite implements DataTransformer {
  /**
   * Creates a new instance of the `TransformerComposite` class.
   * @param {DataTransformer[]} transformers - The list of transformers to be executed.
   */
  constructor (private readonly transformers: DataTransformer[]) {}

  /**
   * Executes the list of transformers on the input data.
   * @param {any} value - The input data to transform.
   * @returns {any} The transformed data.
   */
  execute (value: any): any {
    for (const transformers of this.transformers) {
      value = transformers.execute(value)
    }
    return value
  }
}
