'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: FirestorePermissionError) => {
      // Surfacing contextual information to the Next.js development overlay
      // during development only. In production, this can be handled more gracefully.
      if (process.env.NODE_ENV === 'development') {
        // We throw an uncaught exception to trigger the Next.js error overlay.
        // This is the intended behavior for the agentic error fixing loop.
        throw error;
      } else {
        toast({
          variant: "destructive",
          title: "Error de Permisos",
          description: "No tienes autorización para realizar esta acción. Por favor, contacta al administrador.",
        });
      }
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, [toast]);

  return null;
}