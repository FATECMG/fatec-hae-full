import 'reflect-metadata'
import { CreateFirebaseAccount } from '../createFirebaseAccount.external'
import { getFirebase } from '../../../../../shared/firebase'
import { mocked } from 'ts-jest/utils'

jest.mock('../../../../../shared/utils/firebase')
const mockedFirebase = mocked(getFirebase, true)

describe('createNewFirebaseAccount function', () => {
  const createFirebaseAccount = new CreateFirebaseAccount()
  it('should create a new firebase account', async () => {
    const auth = jest.fn(() => ({
      createUser: async (user: { email: string; password: string }) => {
        return { uid: `${user?.email}-${user?.password}2222` }
      },
    }))
    mockedFirebase.mockImplementation(() => {
      return {
        auth,
      } as any
    })
    const firestoreUid = await createFirebaseAccount.call({
      email: 'user@zelpay.solutions',
      password: '123456',
    })
    expect(auth).toHaveBeenCalledTimes(1)
    expect(firestoreUid).toBe(`user@zelpay.solutions-1234562222`)
  })
  it('should throw an exception cause the service is down', async () => {
    mockedFirebase.mockImplementation(() => {
      throw new Error('google is down')
    })
    try {
      await createFirebaseAccount.call({
        email: 'user@zelpay.solutions',
        password: '123456',
      })
    } catch (err) {
      expect(err.message).toBe(`google is down`)
    }
  })
  it("should throw an exception cause couldn't create an account", async () => {
    mockedFirebase.mockImplementation(() => {
      return {
        auth: () => ({
          createUser: async () => {
            throw new Error("can't create user")
          },
        }),
      } as any
    })
    try {
      await createFirebaseAccount.call({
        email: 'user@zelpay.solutions',
        password: '123456',
      })
    } catch (err) {
      expect(err.message).toBe(`can't create user`)
    }
  })
})
