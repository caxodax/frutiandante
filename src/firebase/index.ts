'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { firebaseConfig } from './config';

export function initializeFirebase() {
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  const firestore = getFirestore(app);
  const auth = getAuth(app);
  const storage = getStorage(app);

  return { app, firestore, auth, storage };
}

export * from './provider';
export { useCollection } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';
export { useUser } from './auth/use-user';
