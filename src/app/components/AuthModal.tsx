"use client";
import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { FcGoogle } from "react-icons/fc";
import { FaTimes, FaEye, FaEyeSlash } from "react-icons/fa";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  setAuthMode?: (mode: 'login' | 'register') => void;
}

export default function AuthModal({ isOpen, onClose, mode, setAuthMode }: AuthModalProps) {
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
    } catch (error) {
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
    } catch (error) {
      setError(mode === 'register' ? 'Error al crear la cuenta' : 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {mode === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors mb-6"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
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
  );
}
