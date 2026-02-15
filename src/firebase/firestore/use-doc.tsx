'use client';

import { useState, useEffect } from 'react';
import { 
  DocumentReference, 
  onSnapshot, 
  DocumentSnapshot, 
  DocumentData,
  FirestoreError
} from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

export function useDoc<T = DocumentData>(docRef: DocumentReference<T> | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!docRef) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot: DocumentSnapshot<T>) => {
        setData(snapshot.exists() ? { ...snapshot.data()!, id: snapshot.id } : null);
        setLoading(false);
      },
      (serverError: FirestoreError) => {
        // Aseguramos que el estado de carga termine incluso en caso de error
        setLoading(false);
        
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'get',
        });

        setError(permissionError);
        
        // Emitimos el error para el sistema de depuración central
        errorEmitter.emit('permission-error', permissionError);
      }
    );

    return () => unsubscribe();
  }, [docRef]);

  return { data, loading, error };
}
