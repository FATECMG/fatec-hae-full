import { type MockProxy, mock } from 'jest-mock-extended'
import { type DataTransformer } from '@common/utils/transformer/Interface'
import { TransformerComposite } from '@common/utils/transformer/TransformerComposite'

describe('TransformerComposite', () => {
  let systemUnderTest: TransformerComposite
  let transformer1: MockProxy<DataTransformer>
  let transformer2: MockProxy<DataTransformer>

  beforeAll(() => {
    transformer1 = mock()
    transformer2 = mock()
    transformer1.execute.mockReturnValue('any_data')
    transformer2.execute.mockReturnValue('any_data')
    systemUnderTest = new TransformerComposite([transformer1, transformer2])
  })

  it('should call transformer correctly', () => {
    const result = systemUnderTest.execute('any_data')

    expect(result).toBe('any_data')
    expect(transformer1.execute).toHaveBeenCalledWith('any_data')
    expect(transformer2.execute).toHaveBeenCalledWith('any_data')
    expect(transformer1.execute).toHaveBeenCalledTimes(1)
    expect(transformer2.execute).toHaveBeenCalledTimes(1)
  })
})
