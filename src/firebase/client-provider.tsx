'use client';

import React, { useEffect, useState } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [firebaseInstances, setFirebaseInstances] = useState<ReturnType<typeof initializeFirebase> | null>(null);

  useEffect(() => {
    const instances = initializeFirebase();
    setFirebaseInstances(instances);
  }, []);

  if (!firebaseInstances) return null;

  return (
    <FirebaseProvider 
      app={firebaseInstances.app} 
      firestore={firebaseInstances.firestore} 
      auth={firebaseInstances.auth}
      storage={firebaseInstances.storage}
    >
      {children}
    </FirebaseProvider>
  );
}
