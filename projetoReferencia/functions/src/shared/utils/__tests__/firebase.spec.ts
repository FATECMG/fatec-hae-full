import { getFirebase } from '../firebase'
import { mocked } from 'ts-jest/utils'
import * as firebaseAdmin from 'firebase-admin'

jest.mock('firebase-admin')
const mockedFirebaseAdmin = mocked(firebaseAdmin, true)

describe('firebase', () => {
  it('should return an instance of firebase', async () => {
    mockedFirebaseAdmin.initializeApp.mockImplementation(() => {
      return {} as firebaseAdmin.app.App
    })
    const firebase = await getFirebase()
    expect(firebase).toBeDefined()
    const firebase2 = await getFirebase()
    expect(firebase2).toBeDefined()
  })
})
