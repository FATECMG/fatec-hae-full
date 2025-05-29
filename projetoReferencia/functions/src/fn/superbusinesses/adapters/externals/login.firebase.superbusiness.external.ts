import { IExternal } from '../../../../shared/adapters/external/interfaces.external'
import { ISuperBusiness } from '../../entities/interfaces.entities'
import firebase from 'firebase/app'
import 'firebase/auth'
import { FIREBASEAPP } from '../../../../shared/config/params'
import { injectable } from 'inversify'
import { DomainError } from '../../../../shared/errors/domain.error'

if (firebase.apps.length === 0) {
  firebase.initializeApp(FIREBASEAPP)
}

export interface Auth {
  firestoreUid?: string
  jwt?: string
}

@injectable()
export class LoginFirebaseSuperBusinessExternal
  implements IExternal<ISuperBusiness, Auth> {
  async call(superBusiness: ISuperBusiness): Promise<Auth> {
    const auth = firebase.auth()
    auth.setPersistence(firebase.auth.Auth.Persistence.NONE)
    let user
    try {
      user = await auth.signInWithEmailAndPassword(
        superBusiness.email,
        superBusiness.password,
      )
    } catch (err) {
      if (err.code === 'auth/invalid-email') {
        throw new DomainError({
          errorCode: 'login-002',
          message: 'Email ou senha inválidos.',
        })
      } else if (err.code === 'auth/wrong-password') {
        throw new DomainError({
          errorCode: 'login-003',
          message: 'Senha inválida',
        })
      } else if (err.code === 'auth/too-many-requests') {
        throw new DomainError({
          errorCode: 'login-004',
          message: 'Muitas tentativas seguidas. Espere alguns minutos.',
        })
      } else if (err.code === 'auth/user-not-found') {
        throw new DomainError({
          errorCode: 'login-005',
          message: 'Conta não cadastrada.',
        })
      }
    }
    return {
      firestoreUid: user.user.uid,
      jwt: await user.user.getIdToken(true),
    }
  }
}
