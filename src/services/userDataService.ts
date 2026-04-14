import type { User } from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import type { UserProfile } from '../types'
import { db } from './firebase'

interface PersistedUserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  streak: number
  totalXP: number
  level: number
  joinedDate: string
}

interface UserDoc {
  profile: PersistedUserProfile
  updatedAt?: unknown
}

function createDefaultProfile(user: User): UserProfile {
  return {
    id: user.uid,
    name: user.displayName || 'Student',
    email: user.email || '',
    avatar: user.photoURL || undefined,
    streak: 0,
    totalXP: 0,
    level: 1,
    joinedDate: new Date(),
  }
}

function toPersistedProfile(profile: UserProfile): PersistedUserProfile {
  return {
    ...profile,
    joinedDate: profile.joinedDate instanceof Date ? profile.joinedDate.toISOString() : new Date(profile.joinedDate).toISOString(),
  }
}

function fromPersistedProfile(profile: PersistedUserProfile): UserProfile {
  return {
    ...profile,
    joinedDate: new Date(profile.joinedDate),
  }
}

export async function loadOrCreateUserProfile(user: User): Promise<UserProfile> {
  const userRef = doc(db, 'userProfiles', user.uid)
  const userSnap = await getDoc(userRef)

  if (userSnap.exists()) {
    const data = userSnap.data() as UserDoc
    if (data.profile) {
      return fromPersistedProfile(data.profile)
    }
  }

  const profile = createDefaultProfile(user)
  await saveUserProfile(user.uid, profile)
  return profile
}

export async function saveUserProfile(uid: string, profile: UserProfile): Promise<void> {
  const userRef = doc(db, 'userProfiles', uid)
  await setDoc(
    userRef,
    {
      profile: toPersistedProfile(profile),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}
