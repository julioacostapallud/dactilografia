'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AdminTabs from './components/AdminTabs';

export default function AdminPage() {
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

  // Si es admin, mostrar el contenido completo con Header y Footer
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 bg-gradient-to-br from-green-100/30 via-green-50/50 to-orange-100/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header del panel */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">⚙️ Panel de Administración</h1>
                <p className="mt-2 text-gray-600">Gestión completa del sistema</p>
              </div>
              <div className="text-sm text-gray-500">
                Usuario: {user.email}
              </div>
            </div>
          </div>

          {/* Sistema de Tabs */}
          <AdminTabs />
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
