'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { API_BASE_URL, API_ENDPOINTS } from '../../lib/config';

interface PageVisit {
  id: number;
  pageUrl: string;
  visitStart: string;
  visitEnd: string | null;
  timeOnPageSeconds: number | null;
  ipAddress: string | null;
  userAgent: string | null;
}

interface VisitData {
  date: string;
  visits: number;
  totalTime: number;
}

export default function AdminPage() {
  const [visitData, setVisitData] = useState<VisitData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVisitData();
  }, []);

  const fetchVisitData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.pageVisits}?limit=100`);
      const result = await response.json();

      if (result.success) {
        const visits: PageVisit[] = result.data;
        
        // Agrupar visitas por día
        const dailyData = visits.reduce((acc: { [key: string]: VisitData }, visit) => {
          const date = new Date(visit.visitStart).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          });

          if (!acc[date]) {
            acc[date] = {
              date,
              visits: 0,
              totalTime: 0
            };
          }

          acc[date].visits += 1;
          if (visit.timeOnPageSeconds) {
            acc[date].totalTime += visit.timeOnPageSeconds;
          }

          return acc;
        }, {});

        // Convertir a array y ordenar por fecha
        const sortedData = Object.values(dailyData).sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        setVisitData(sortedData);
      } else {
        setError('Error al cargar los datos');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
      console.error('Error fetching visit data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={fetchVisitData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="mt-2 text-gray-600">Análisis de visitas y estadísticas</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total de Visitas</h3>
            <p className="text-3xl font-bold text-blue-600">
              {visitData.reduce((sum, day) => sum + day.visits, 0)}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Días Activos</h3>
            <p className="text-3xl font-bold text-green-600">
              {visitData.length}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Tiempo Promedio</h3>
            <p className="text-3xl font-bold text-purple-600">
              {Math.round(visitData.reduce((sum, day) => sum + day.totalTime, 0) / 
                visitData.reduce((sum, day) => sum + day.visits, 0) || 0)}s
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Visitas por Día</h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={visitData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    name === 'visits' ? `${value} visitas` : `${Math.round(value)}s`,
                    name === 'visits' ? 'Visitas' : 'Tiempo Total'
                  ]}
                  labelFormatter={(label) => `Fecha: ${label}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="visits" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Visitas"
                />
                <Line 
                  type="monotone" 
                  dataKey="totalTime" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  name="Tiempo Total (s)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Datos Detallados</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Visitas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tiempo Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Promedio por Visita
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {visitData.map((day, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {day.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {day.visits}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {Math.round(day.totalTime)}s
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {day.visits > 0 ? Math.round(day.totalTime / day.visits) : 0}s
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
