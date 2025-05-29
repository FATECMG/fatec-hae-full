import { injectable } from 'inversify'
import { IExternal } from '../../../../shared/adapters/external/interfaces.external'
import { getFirebase } from '../../../../shared/firebase'

export interface Credential {
  email: string
  password: string
}

@injectable()
export class CreateFirebaseAccount implements IExternal<Credential, string> {
  async call(credential: Credential): Promise<string> {
    const app = getFirebase()
    const auth = app.auth()
    auth.setCustomUserClaims
    const createdUser = await auth.createUser(credential)
    return createdUser.uid
  }
}
