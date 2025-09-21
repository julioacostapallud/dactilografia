'use client';

import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 bg-gradient-to-br from-blue-50/50 via-blue-100/30 to-green-100/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Política de Privacidad</h1>
            <p className="text-xl text-gray-600">Última actualización: {new Date().toLocaleDateString('es-AR')}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Información General</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              DACTILO es una aplicación web gratuita desarrollada por Julio Acosta. Esta Política de Privacidad 
              describe cómo recopilamos, utilizamos y protegemos tu información cuando utilizas nuestro servicio.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Al utilizar DACTILO, aceptas las prácticas descritas en esta política.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Información que Recopilamos</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Información de Cuenta</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Dirección de correo electrónico (para registro y autenticación)</li>
                  <li>Nombre (opcional, proporcionado por el usuario)</li>
                  <li>Imagen de perfil (opcional, proporcionada por el usuario)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Datos de Uso</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Resultados de práctica de dactilografía (WPM, precisión, tiempo)</li>
                  <li>Fechas y horarios de sesiones de práctica</li>
                  <li>Páginas visitadas y tiempo de permanencia</li>
                  <li>Información del dispositivo y navegador</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Cookies y Tecnologías Similares</h3>
                <p className="text-gray-700">
                  Utilizamos cookies para mantener tu sesión activa, recordar tus preferencias y mejorar 
                  la experiencia de usuario. También utilizamos Google AdSense, que puede establecer cookies 
                  para mostrar anuncios relevantes.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Cómo Utilizamos tu Información</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Autenticación y Seguridad</h4>
                  <p className="text-gray-600 text-sm">Verificar tu identidad y proteger tu cuenta</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Progreso y Estadísticas</h4>
                  <p className="text-gray-600 text-sm">Mostrar tu historial de práctica y mejoras</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-sm font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Mejoras del Servicio</h4>
                  <p className="text-gray-600 text-sm">Analizar uso para optimizar la aplicación</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 text-sm font-bold">4</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Comunicación</h4>
                  <p className="text-gray-600 text-sm">Enviar actualizaciones importantes del servicio</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Google AdSense</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              DACTILO utiliza Google AdSense para mostrar anuncios. Google puede utilizar cookies 
              y tecnologías similares para mostrar anuncios basados en tus visitas a este sitio 
              y otros sitios web.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Puedes optar por no recibir anuncios personalizados visitando la página de 
              configuración de anuncios de Google en{' '}
              <a 
                href="https://www.google.com/settings/ads" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                www.google.com/settings/ads
              </a>.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Compartir Información</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              No vendemos, alquilamos ni compartimos tu información personal con terceros, 
              excepto en las siguientes circunstancias:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Con proveedores de servicios que nos ayudan a operar la aplicación (como Google AdSense)</li>
              <li>Cuando sea requerido por ley o para proteger nuestros derechos legales</li>
              <li>Con tu consentimiento explícito</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Seguridad de Datos</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Implementamos medidas de seguridad técnicas y organizativas para proteger tu 
              información personal contra acceso no autorizado, alteración, divulgación o destrucción.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Sin embargo, ningún método de transmisión por Internet o almacenamiento electrónico 
              es 100% seguro, por lo que no podemos garantizar la seguridad absoluta.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Tus Derechos</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Tienes derecho a:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Acceder a tu información personal</li>
              <li>Corregir información inexacta</li>
              <li>Eliminar tu cuenta y datos asociados</li>
              <li>Retirar tu consentimiento en cualquier momento</li>
              <li>Recibir una copia de tus datos en formato legible</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Contacto</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Si tienes preguntas sobre esta Política de Privacidad o sobre cómo manejamos tu información, 
              puedes contactarnos en:
            </p>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-blue-800 font-medium">
                Email: julioacostapallud@gmail.com
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-8 text-white">
            <h2 className="text-2xl font-semibold mb-4">Cambios a esta Política</h2>
            <p className="text-blue-100 mb-6">
              Podemos actualizar esta Política de Privacidad ocasionalmente. Te notificaremos 
              sobre cambios significativos publicando la nueva política en esta página.
            </p>
            <Link 
              href="/" 
              className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
