"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useEffect } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isAuthenticated, isLoading, requireAuth } = useAuth();

  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

  if (isLoading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100/30 via-green-50/50 to-orange-100/30">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Verificando autenticación...</p>
          </div>
        </div>
      )
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login via requireAuth
  }

  return <>{children}</>;
}
