import admin from 'firebase-admin'
import fs from 'fs'

const serviceAccount = JSON.parse(fs.readFileSync('./src/serviceAccountKey.json', 'utf8'))

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

export default admin
