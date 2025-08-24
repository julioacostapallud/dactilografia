'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from "next-auth/react";
import { FaUser } from "react-icons/fa";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-gradient-to-r from-green-700 via-green-500 via-orange-500 to-orange-600 shadow-md px-6 py-4">
              <div className="flex justify-between items-center w-full">
          <div className="flex items-center space-x-8">
            <div className="flex flex-col items-center">
              <h1 className="text-2xl font-bold text-white">DACTILO</h1>
              {/* Icono: Teclado + Velocidad */}
              <svg width="40" height="20" viewBox="0 0 40 20" className="cursor-pointer hover:scale-110 transition-transform">
                <rect x="0" y="0" width="8" height="6" rx="1" fill="white" opacity="0.9"/>
                <rect x="9" y="0" width="8" height="6" rx="1" fill="white" opacity="0.7"/>
                <rect x="18" y="0" width="8" height="6" rx="1" fill="white" opacity="0.5"/>
                <rect x="27" y="0" width="8" height="6" rx="1" fill="white" opacity="0.3"/>
                <path d="M0 8 L35 8" stroke="white" strokeWidth="1" opacity="0.6"/>
                <path d="M0 10 L30 10" stroke="white" strokeWidth="1" opacity="0.4"/>
                <path d="M0 12 L25 12" stroke="white" strokeWidth="1" opacity="0.2"/>
              </svg>
            </div>
            
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
            </nav>
          </div>
        <div className="flex items-center justify-center w-10 h-10 cursor-pointer hover:bg-white/20 rounded-full border-2 border-white transition-colors">
          {session ? (
            <div className="flex items-center gap-2">
              {session.user?.image ? (
                <img 
                  src={session.user.image} 
                  alt={session.user.name || "Usuario"} 
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <FaUser className="text-white text-lg" />
              )}
              <button 
                onClick={() => signOut()}
                className="text-white text-xs hover:underline"
              >
                Salir
              </button>
            </div>
          ) : (
            <button 
              onClick={() => signIn('google')}
              className="text-white text-xs hover:underline"
            >
              Entrar
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
