// src/authentication/firebase-strategy.ts
import { AuthenticationBaseStrategy, AuthenticationResult } from '@feathersjs/authentication'
import { Params } from '@feathersjs/feathers'
import admin from './firebase' // sizning firebase.ts (firebase-admin init)
import { Application } from './declarations'

interface AuthenticationPayload {
  strategy: string
  accessToken: string // frontenddan yuborilgan Firebase ID token
}

export class FirebaseStrategy extends AuthenticationBaseStrategy {
  get configuration() {
    const config = super.configuration || {}
    return {
      ...config,
      service: 'users'
    }
  }

  async authenticate(authentication: AuthenticationPayload, params: Params): Promise<AuthenticationResult> {
    const { accessToken } = authentication
    const { service } = this.configuration
    const app = this.app as Application
    const users = app.service(service)

    if (!accessToken) throw new Error('No accessToken provided')

    try {
      const decoded = await admin.auth().verifyIdToken(accessToken)
      console.log('✅ UID:', decoded.uid, 'Email:', decoded.email)

      const result = await users.find({
        query: { firebaseUid: decoded.uid },
        paginate: false
      })

      let user = result[0]

      if (!user) {
        user = await users.create({
          email: decoded.email || '',
          firebaseUid: decoded.uid
        })
      }

      return {
        authentication: { strategy: this.name },
        user
      }
    } catch (error: any) {
      console.error('Firebase auth error:', error)
      throw new Error('Invalid Firebase token: ' + (error.message || error))
    }
  }
}
