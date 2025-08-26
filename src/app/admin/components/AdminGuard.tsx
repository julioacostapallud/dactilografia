'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // Si no está autenticado, redirigir al login
      if (!isAuthenticated) {
        router.push('/');
        return;
      }

      // Si está autenticado pero no es admin, redirigir al home
      if (user?.email !== 'julioacostapallud@gmail.com') {
        router.push('/');
        return;
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  // Mostrar loading mientras verifica
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Si no está autenticado o no es admin, no mostrar nada (se redirige)
  if (!isAuthenticated || user?.email !== 'julioacostapallud@gmail.com') {
    return null;
  }

  // Si es admin, mostrar el contenido
  return <>{children}</>;
}
