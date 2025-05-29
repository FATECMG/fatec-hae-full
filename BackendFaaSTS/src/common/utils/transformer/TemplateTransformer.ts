/* eslint-disable no-prototype-builtins */
import { type DataTransformer } from '@common/utils/transformer/Interface'

export abstract class TemplateTransformer implements DataTransformer {
  /**
   * Performs a transformation on the input data.
   * @abstract
   * @param {any} param - The input data to transform.
   * @returns {any} The transformed data.
   */
  abstract performTransformation (param: any): any

  /**
   * Executes the transformation on the input data.
   * @param {any} param - The input data to transform.
   * @returns {any} The transformed data.
   */
  execute (param: any): any {
    if (typeof param === 'string') {
      return this.performTransformation(param)
    }
    if (Array.isArray(param)) {
      return param.map(item => this.execute(item))
    }
    if (typeof param === 'object') {
      const trimmedObject: any = {}

      for (const key in param) {
        if (param.hasOwnProperty(key) !== undefined) {
          trimmedObject[key] = this.execute(param[key])
        }
      }
      return trimmedObject
    }
    return param
  }
}
