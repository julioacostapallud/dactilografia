'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from "@/lib/hooks/useAuth";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import AuthModal from './AuthModal';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Verificar si el usuario es admin
  const isAdmin = user?.email === 'julioacostapallud@gmail.com';

  return (
    <header className="bg-gradient-to-r from-green-700 via-green-500 via-orange-500 to-orange-600 shadow-md px-6 py-3">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-3 cursor-pointer hover:scale-105 transition-transform">
            {/* Logo: Teclado + Velocidad */}
            <svg width="40" height="20" viewBox="0 0 40 20" className="flex-shrink-0" style={{ marginTop: '7px' }}>
              <rect x="0" y="2" width="8" height="6" rx="1" fill="white" opacity="0.9"/>
              <rect x="9" y="2" width="8" height="6" rx="1" fill="white" opacity="0.7"/>
              <rect x="18" y="2" width="8" height="6" rx="1" fill="white" opacity="0.5"/>
              <rect x="27" y="2" width="8" height="6" rx="1" fill="white" opacity="0.3"/>
              <path d="M0 10 L35 10" stroke="white" strokeWidth="1" opacity="0.6"/>
              <path d="M0 12 L30 12" stroke="white" strokeWidth="1" opacity="0.4"/>
              <path d="M0 14 L25 14" stroke="white" strokeWidth="1" opacity="0.2"/>
            </svg>
            <h1 className="text-2xl font-bold text-white">Dactilo</h1>
          </Link>
          
          {/* Navegación */}
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="text-white hover:text-blue-200 transition-colors font-medium">
              Inicio
            </Link>
            <Link href="/about" className="text-white hover:text-blue-200 transition-colors font-medium">
              Acerca de
            </Link>
            <Link href="/contact" className="text-white hover:text-blue-200 transition-colors font-medium">
              Contacto
            </Link>
            {isAdmin && (
              <Link href="/admin" className="text-white hover:text-blue-200 transition-colors font-medium bg-red-600 px-3 py-1 rounded">
                Admin
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-white">
                {user?.image ? (
                  <img 
                    src={user.image} 
                    alt={user.name || "Usuario"} 
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                ) : (
                  <FaUser className="text-white text-lg" />
                )}
                <span className="text-sm font-medium hidden sm:block">
                  {user?.name || "Usuario"}
                </span>
              </div>
              <button 
                onClick={logout}
                className="flex items-center gap-1 text-white text-sm hover:text-blue-200 transition-colors"
              >
                <FaSignOutAlt className="text-sm" />
                <span className="hidden sm:block">Salir</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  setAuthMode('login');
                  setShowAuthModal(true);
                }}
                className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors font-medium"
              >
                <FaUser className="text-sm" />
                <span className="hidden sm:block">Entrar</span>
              </button>
              <button 
                onClick={() => {
                  setAuthMode('register');
                  setShowAuthModal(true);
                }}
                className="flex items-center gap-2 bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-sm"
              >
                <span className="text-sm">Registrarse</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Autenticación */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
      />
    </header>
  );
}
