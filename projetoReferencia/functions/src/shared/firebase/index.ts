import firebase from 'firebase-admin'
import * as functions from 'firebase-functions'
import { FIREBASEAPP, ADMINSDK } from '../config/params'

let instance: firebase.app.App = null

export function getFirebase() {
  if (instance) {
    return instance
  }

  instance = firebase.initializeApp({
    ...FIREBASEAPP,
    credential: firebase.credential.cert(ADMINSDK),
  })

  return instance
}

export function getZelpayPublicKey(): Promise<string> {
  return functions.config().payment.public.toString()
}
