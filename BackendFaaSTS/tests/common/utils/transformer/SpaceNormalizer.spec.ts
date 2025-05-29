import { SpaceNormalizer } from '@common/utils/transformer/spaceNormalizer/SpaceNormalizer'

describe('SpaceNormalizer', () => {
  let systemUnderTest: SpaceNormalizer

  beforeAll(() => {
    systemUnderTest = new SpaceNormalizer()
  })

  it('should remove all extra spaces', () => {
    const result = systemUnderTest.performTransformation('a  b   c')

    expect(result).toEqual('a b c')
  })
})
