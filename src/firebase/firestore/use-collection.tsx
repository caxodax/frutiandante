'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Query, 
  onSnapshot, 
  QuerySnapshot, 
  DocumentData,
  FirestoreError
} from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

export function useMemoFirebase<T>(factory: () => T, deps: any[]): T {
  return useMemo(factory, deps);
}

export function useCollection<T = DocumentData>(query: Query<T> | null) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(!!query);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      setData(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = onSnapshot(
      query,
      (snapshot: QuerySnapshot<T>) => {
        const items = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));
        setData(items);
        setLoading(false);
        setError(null);
      },
      (serverError: FirestoreError) => {
        setLoading(false);
        
        if (serverError.code === 'permission-denied') {
          const permissionError = new FirestorePermissionError({
            path: (query as any)?._query?.path?.toString() || 'unknown',
            operation: 'list',
          });
          
          setError(permissionError);
          errorEmitter.emit('permission-error', permissionError);
        } else {
          setError(serverError);
        }
      }
    );

    return () => unsubscribe();
  }, [query]);

  return { data, loading, error };
}