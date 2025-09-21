"use client";
import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  setAuthMode?: (mode: 'login' | 'register') => void;
}

export default function AuthModal({ isOpen, onClose, mode }: AuthModalProps) {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Limpiar formulario cuando cambie el modo
  useEffect(() => {
    setError('');
    setEmail('');
    setPassword('');
    setName('');
  }, [mode]);

  // Cerrar modal automáticamente cuando la sesión esté lista
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      onClose();
    }
  }, [status, session, onClose]);


  
  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    try {
      await signIn("google", {
        callbackUrl: "/",
        redirect: false,
      });
      // El modal se cerrará automáticamente cuando la sesión esté lista
    } catch {
      setError('Error al iniciar sesión con Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (mode === 'register') {
        // Registro
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            name,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          // Si el registro es exitoso, hacer login automáticamente
          const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
          });

          if (result?.error) {
            setError('Cuenta creada pero error al iniciar sesión');
          }
        } else {
          setError(data.error || 'Error al crear la cuenta');
        }
      } else {
        // Login
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          setError('Credenciales inválidas');
        }
      }
    } catch {
      setError(mode === 'register' ? 'Error al crear la cuenta' : 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
                      <div className="relative bg-white rounded-2xl shadow-2xl border-2 border-gray-200 w-full max-w-md animate-in slide-in-from-bottom-4 duration-300">
          {/* Header integrado */}
          <div className="flex justify-between items-center w-full bg-gradient-to-r from-green-600 via-green-500 to-orange-500 rounded-t-2xl p-1">
          {/* Logo + Dactilo */}
          <div className="flex items-center space-x-1">
            <svg width="30" height="15" viewBox="0 0 40 20" className="flex-shrink-0" style={{ marginTop: '6px' }}>
              <rect x="0" y="2" width="8" height="6" rx="1" fill="white" opacity="0.9"/>
              <rect x="9" y="2" width="8" height="6" rx="1" fill="white" opacity="0.7"/>
              <rect x="18" y="2" width="8" height="6" rx="1" fill="white" opacity="0.5"/>
              <rect x="27" y="2" width="8" height="6" rx="1" fill="white" opacity="0.3"/>
              <path d="M0 10 L35 10" stroke="white" strokeWidth="1" opacity="0.6"/>
              <path d="M0 12 L30 12" stroke="white" strokeWidth="1" opacity="0.4"/>
              <path d="M0 14 L25 14" stroke="white" strokeWidth="1" opacity="0.2"/>
            </svg>
            <h2 className="text-sm font-bold text-white">Dactilo</h2>
            <span className="text-white/70 text-sm">•</span>
            <span className="text-sm font-semibold text-orange-200">
              {mode === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
            </span>
          </div>
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 transition-colors duration-200"
            aria-label="Cerrar modal"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white hover:text-orange-300 transition-colors">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="p-6">

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 hover:border-orange-300 transition-all duration-200 mb-6 shadow-sm"
        >
          <FcGoogle className="w-5 h-5" />
          <span>Continuar con Google</span>
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">O</span>
          </div>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={mode === 'register'}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                placeholder="Tu nombre completo"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 pr-10 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <FaEyeSlash className="text-gray-400" />
                ) : (
                  <FaEye className="text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 px-4 rounded-lg hover:from-green-500 hover:to-green-400 transition-all duration-200 disabled:from-green-300 disabled:to-green-400 disabled:opacity-50 font-bold shadow-md disabled:shadow-none"
          >
            {isLoading ? 'Cargando...' : (mode === 'login' ? 'Iniciar Sesión' : 'Registrarse')}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
          </p>
        </div>
        </div>
      </div>
    </div>
  );
}
