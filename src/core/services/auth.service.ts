import { auth, getUserRef } from './firebase'
import type { UserProfile } from './firebase'
import { createUserWithEmailAndPassword, signOut, updateProfile, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signInAnonymously, sendPasswordResetEmail } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { setDoc, serverTimestamp, getDoc, updateDoc } from 'firebase/firestore'

export interface AuthError {
  code: string
  message: string
  userMessage: string
}

const AUTH_ERRORS: Record<string, string> = {
  'auth/email-already-in-use': 'Этот email уже зарегистрирован',
  'auth/invalid-email': 'Некорректный формат email',
  'auth/weak-password': 'Пароль должен содержать минимум 6 символов',
  'auth/user-not-found': 'Пользователь не найден',
  'auth/wrong-password': 'Неверный пароль',
  'auth/too-many-requests': 'Слишком много попыток. Попробуйте позже',
  'auth/operation-not-allowed': 'Это действие сейчас недоступно',
  'auth/network-request-failed': 'Ошибка сети. Проверьте подключение'
};

function transformAuthError(error: unknown): AuthError {
  const defaultError: AuthError = {
    code: 'auth/unknown',
    message: 'Unknown error',
    userMessage: 'Произошла неизвестная ошибка'
  };

  if (typeof error === 'object' && error !== null) {
    const err = error as Record<string, unknown>;
    const code = typeof err.code === 'string' ? err.code : defaultError.code;
    const message = typeof err.message === 'string' ? err.message : defaultError.message;
    return {
      code,
      message,
      userMessage: AUTH_ERRORS[code] || defaultError.userMessage
    };
  }

  return defaultError;
}


export async function registerUser(
  email: string,
  password: string,
  displayName: string
): Promise<User> {
  if (!email || !password || !displayName){
    throw {
       code: 'auth/invalid-argument',
      message: 'Missing required fields',
      userMessage: 'Заполните все обязательные поля'
    }
  } try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    await updateProfile(user, { displayName })

    const UserProfile: UserProfile = {
      id: user.uid,
      email: user.email || '',
      displayName,
      createdAt: new Date(),
      lastLoginAt: new Date(),
      preferences: {
        theme: 'system',
        language: 'ru',
        fontSize: 16
      }
    }

    await setDoc(getUserRef(user.uid), UserProfile)
    return user
  } catch (error) {
    throw transformAuthError(error)
  }
}

export async function loginWithGoogle(): Promise<User> {
  try {
    const provider = new GoogleAuthProvider()
    const userCredential = await signInWithPopup(auth, provider)
    await updateLastLogin(userCredential.user.uid)

    if (!userCredential.user.email) {
      throw {
        code: 'auth/no-email',
        message: 'Google account does not have email',
        userMessage: 'Ваш Google аккаунт не содержит email'
      }
    }
    const userDoc = await getDoc(getUserRef(userCredential.user.uid))
    if (!userDoc.exists()){
      const UserProfile: UserProfile = {
        id: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName || 'Google User',
        createdAt: new Date(),
        lastLoginAt: new Date(),
        preferences: {
          theme: 'system',
          language: 'ru',
          fontSize: 16
        }
      }
      await setDoc(getUserRef(userCredential.user.uid), UserProfile)
    }
    return userCredential.user
  } catch (error) {
    throw transformAuthError(error)
  }
}

export async function guestLogin(): Promise<User> {
  try {
    const userCredential = await signInAnonymously(auth)
    return userCredential.user
  } catch (error) {
    throw transformAuthError(error)
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth)
  } catch (error) {
    throw transformAuthError(error)
  }
}

export async function resetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email)
  } catch (error) {
    throw transformAuthError(error)
  }
}

export function subscribeToAuthChanges(
  callback: (user: User | null) => void
): () => void {
  return onAuthStateChanged(auth, async (user) => {
    if (user && !user.isAnonymous) {
      await updateLastLogin(user.uid)
    }
    callback(user)
  })
}

export async function updateLastLogin(userId: string): Promise<void> {
  try {
    await updateDoc(getUserRef(userId), {
      lastLoginAt: serverTimestamp()
    })
  } catch (error) {
    console.error('Failed to update last login:', error)
  }
}
