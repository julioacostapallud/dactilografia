'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect } from 'react';
import { apiService } from '@/lib/api';

export function useAuth() {
  const { data: session, status } = useSession();

  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  // Enviar datos del usuario al backend cuando se autentique
  useEffect(() => {
    if (isAuthenticated && session?.user) {
      console.log("🔵 REGISTRO GOOGLE - Enviando usuario al backend:", {
        email: session.user.email,
        name: session.user.name,
        image: session.user.image
      });
      
      // Enviar datos al backend
      fetch(`${apiService.getBaseUrl()}/api/auth/save-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session.user.email,
          name: session.user.name,
          image_url: session.user.image,
          provider: 'google'
        }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log("✅ REGISTRO GOOGLE - Usuario guardado exitosamente");
        } else {
          console.error("❌ REGISTRO GOOGLE - Error:", data.error);
        }
      })
      .catch(error => {
        console.error("❌ REGISTRO GOOGLE - Error de conexión:", error);
      });
    }
  }, [isAuthenticated, session]);

  const logout = async () => {
    await signOut({ redirect: false });
  };

  return {
    user: session?.user,
    isAuthenticated,
    isLoading,
    logout,
  };
}
