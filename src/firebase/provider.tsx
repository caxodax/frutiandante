'use client';

import React, { createContext, useContext } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';
import { FirebaseStorage } from 'firebase/storage';

interface FirebaseContextType {
  app: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  storage: FirebaseStorage;
}

const FirebaseContext = createContext<FirebaseContextType | null>(null);

export function FirebaseProvider({ 
  children, 
  app, 
  firestore, 
  auth,
  storage
}: { 
  children: React.ReactNode; 
  app: FirebaseApp; 
  firestore: Firestore; 
  auth: Auth;
  storage: FirebaseStorage;
}) {
  return (
    <FirebaseContext.Provider value={{ app, firestore, auth, storage }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export const useFirebaseApp = () => {
  const context = useContext(FirebaseContext);
  if (!context) throw new Error('useFirebaseApp must be used within FirebaseProvider');
  return context.app;
};

export const useFirestore = () => {
  const context = useContext(FirebaseContext);
  if (!context) throw new Error('useFirestore must be used within FirebaseProvider');
  return context.firestore;
};

export const useAuth = () => {
  const context = useContext(FirebaseContext);
  if (!context) throw new Error('useAuth must be used within FirebaseProvider');
  return context.auth;
};

export const useStorage = () => {
  const context = useContext(FirebaseContext);
  if (!context) throw new Error('useStorage must be used within FirebaseProvider');
  return context.storage;
};
