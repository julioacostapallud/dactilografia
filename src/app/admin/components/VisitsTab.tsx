'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiService, PageVisit } from '@/lib/api';
import { FaEye, FaDesktop, FaMobile, FaTablet, FaGlobe, FaClock, FaUser } from 'react-icons/fa';

export default function VisitsTab() {
  const [visits, setVisits] = useState<PageVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalVisits, setTotalVisits] = useState(0);
  const [itemsPerPage] = useState(20);

  const fetchVisits = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiService.getVisits(currentPage, itemsPerPage);
      
      if (response.visits) {
        setVisits(response.visits);
        setTotalPages(response.pagination.totalPages);
        setTotalVisits(response.pagination.total);
      } else {
        setError('Error al cargar las visitas');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
      console.error('Error fetching visits:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    fetchVisits();
  }, [fetchVisits]);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  const formatTime = (seconds: number | undefined) => {
    if (!seconds) return 'N/A';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const getDeviceIcon = (deviceType?: string) => {
    switch (deviceType?.toLowerCase()) {
      case 'mobile':
        return <FaMobile className="w-4 h-4 text-blue-500" />;
      case 'tablet':
        return <FaTablet className="w-4 h-4 text-green-500" />;
      default:
        return <FaDesktop className="w-4 h-4 text-gray-500" />;
    }
  };

  const getBrowserIcon = (browser?: string) => {
    const browserLower = browser?.toLowerCase();
    if (browserLower?.includes('chrome')) return '🟢';
    if (browserLower?.includes('firefox')) return '🟠';
    if (browserLower?.includes('safari')) return '🔵';
    if (browserLower?.includes('edge')) return '🔷';
    return '🌐';
  };

  const truncateUrl = (url: string | undefined, maxLength: number = 50) => {
    if (!url) return 'N/A';
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Cargando visitas...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-500 mb-2">⚠️</div>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={fetchVisits}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header con estadísticas */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Visitas</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <FaEye className="w-5 h-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Total Visitas</p>
                <p className="text-2xl font-bold text-blue-600">{totalVisits.toLocaleString()}</p>
              </div>
            </div>
          </div>
                     <div className="bg-green-50 p-4 rounded-lg">
             <div className="flex items-center">
               <FaUser className="w-5 h-5 text-green-600 mr-2" />
               <div>
                 <p className="text-sm text-gray-600">Usuarios Únicos</p>
                 <p className="text-2xl font-bold text-green-600">
                   {visits.filter(v => v.userId).length}
                 </p>
               </div>
             </div>
           </div>
                     <div className="bg-purple-50 p-4 rounded-lg">
             <div className="flex items-center">
               <FaGlobe className="w-5 h-5 text-purple-600 mr-2" />
               <div>
                 <p className="text-sm text-gray-600">Páginas Únicas</p>
                 <p className="text-2xl font-bold text-purple-600">
                   {new Set(visits.map(v => v.pageUrl)).size}
                 </p>
               </div>
             </div>
           </div>
                     <div className="bg-orange-50 p-4 rounded-lg">
             <div className="flex items-center">
               <FaClock className="w-5 h-5 text-orange-600 mr-2" />
               <div>
                 <p className="text-sm text-gray-600">Tiempo Promedio</p>
                 <p className="text-2xl font-bold text-orange-600">
                   {(() => {
                     const visitsWithTime = visits.filter(v => v.timeOnPageSeconds);
                     if (visitsWithTime.length === 0) return 'N/A';
                     const totalTime = visitsWithTime.reduce((acc, v) => acc + (v.timeOnPageSeconds || 0), 0);
                     const avgTime = Math.round(totalTime / visitsWithTime.length);
                     return formatTime(avgTime);
                   })()}
                 </p>
               </div>
             </div>
           </div>
        </div>
      </div>

      {/* Tabla de visitas */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Página
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dispositivo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Navegador
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tiempo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {visits.map((visit) => (
                <tr key={visit.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {truncateUrl(visit.pageUrl)}
                    </div>
                    {visit.referrerUrl && (
                      <div className="text-xs text-gray-500">
                        Desde: {truncateUrl(visit.referrerUrl, 30)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {visit.userId ? (
                      <div className="text-sm text-gray-900">{visit.userId}</div>
                    ) : (
                      <div className="text-sm text-gray-500">Anónimo</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getDeviceIcon(visit.deviceType)}
                      <span className="ml-2 text-sm text-gray-900 capitalize">
                        {visit.deviceType || 'Desconocido'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{getBrowserIcon(visit.browser)}</span>
                      <span className="text-sm text-gray-900 capitalize">
                        {visit.browser || 'Desconocido'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {visit.ipAddress || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatTime(visit.timeOnPageSeconds)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(visit.visitStart)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> a{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, totalVisits)}
                  </span>{' '}
                  de <span className="font-medium">{totalVisits}</span> resultados
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Siguiente
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
