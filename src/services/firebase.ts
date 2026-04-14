import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyDIEMz3Te1koIEHafN6alnHUfV-xCP9R8g',
  authDomain: 'gen-lang-client-0653183157.firebaseapp.com',
  projectId: 'gen-lang-client-0653183157',
  storageBucket: 'gen-lang-client-0653183157.firebasestorage.app',
  messagingSenderId: '771012047412',
  appId: '1:771012047412:web:d531bae6bcf3e60eda9061',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
