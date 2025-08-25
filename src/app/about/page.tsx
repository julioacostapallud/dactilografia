'use client';

import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 bg-gradient-to-br from-green-100/30 via-green-50/50 to-orange-100/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Acerca de DACTILO</h1>
            <p className="text-xl text-gray-600">Mejorando la velocidad de tipeo desde 2024</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">¿Qué es DACTILO?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              DACTILO es una plataforma web gratuita diseñada para ayudarte a mejorar tu velocidad de tipeo 
              y perfeccionar tu técnica de dactilografía. Nuestra aplicación está especialmente orientada 
              a estudiantes, profesionales y cualquier persona que desee optimizar su productividad en la escritura.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Utilizamos textos legales reales como material de práctica, lo que no solo mejora tu velocidad 
              sino que también te familiariza con terminología profesional y documentos formales.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Características Principales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Textos Legales Reales</h4>
                  <p className="text-gray-600 text-sm">Practica con documentos legales auténticos</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Medición de WPM</h4>
                  <p className="text-gray-600 text-sm">Calcula tu velocidad en palabras por minuto</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-sm font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Interfaz Moderna</h4>
                  <p className="text-gray-600 text-sm">Diseño responsive y fácil de usar</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 text-sm font-bold">4</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Completamente Gratuito</h4>
                  <p className="text-gray-600 text-sm">Sin costos ocultos ni suscripciones</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-8 text-white">
            <h2 className="text-2xl font-semibold mb-4">¡Comienza a mejorar tu velocidad de tipeo hoy!</h2>
            <p className="text-blue-100 mb-6">
              Únete a miles de usuarios que ya han mejorado sus habilidades de dactilografía con DACTILO.
            </p>
            <Link 
              href="/" 
              className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Empezar a Practicar
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
