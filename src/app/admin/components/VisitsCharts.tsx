'use client';

import { useEffect, useState } from 'react';
import { apiService, PageVisit } from '@/lib/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartData {
  visits: PageVisit[];
  totalVisits: number;
  uniqueUsers: number;
  uniquePages: number;
  averageTime: number;
}

export default function VisitsCharts() {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getVisits(1, 1000); // Obtener más datos para análisis
      const visits = response.visits;

      // Calcular estadísticas
      const uniqueUsers = new Set(visits.map(v => v.sessionId)).size;
      const uniquePages = new Set(visits.map(v => v.pageUrl)).size;
      const visitsWithTime = visits.filter(v => v.timeOnPageSeconds);
      const averageTime = visitsWithTime.length > 0 
        ? visitsWithTime.reduce((acc, v) => acc + (v.timeOnPageSeconds || 0), 0) / visitsWithTime.length 
        : 0;

      setChartData({
        visits,
        totalVisits: visits.length,
        uniqueUsers,
        uniquePages,
        averageTime
      });
    } catch (err) {
      setError('Error al cargar datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !chartData) {
    return (
      <div className="text-center text-red-600 p-8">
        Error al cargar los gráficos: {error}
      </div>
    );
  }

  // Preparar datos para gráficos
  const prepareTimeSeriesData = () => {
    const visitsByDate = chartData.visits.reduce((acc, visit) => {
      const date = new Date(visit.visitStart).toLocaleDateString('es-ES');
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sortedDates = Object.keys(visitsByDate).sort((a, b) => {
      const dateA = new Date(a.split('/').reverse().join('-'));
      const dateB = new Date(b.split('/').reverse().join('-'));
      return dateA.getTime() - dateB.getTime();
    });

    return {
      labels: sortedDates,
      datasets: [{
        label: 'Visitas',
        data: sortedDates.map(date => visitsByDate[date]),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      }]
    };
  };

  const prepareBrowserData = () => {
    const browserCounts = chartData.visits.reduce((acc, visit) => {
      const browser = visit.browser || 'Desconocido';
      acc[browser] = (acc[browser] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const colors = [
      'rgba(59, 130, 246, 0.8)',   // Blue
      'rgba(16, 185, 129, 0.8)',   // Green
      'rgba(245, 158, 11, 0.8)',   // Yellow
      'rgba(239, 68, 68, 0.8)',    // Red
      'rgba(139, 92, 246, 0.8)',   // Purple
    ];

    return {
      labels: Object.keys(browserCounts),
      datasets: [{
        data: Object.values(browserCounts),
        backgroundColor: colors.slice(0, Object.keys(browserCounts).length),
        borderWidth: 2,
        borderColor: '#fff',
      }]
    };
  };

  const prepareDeviceData = () => {
    const deviceCounts = chartData.visits.reduce((acc, visit) => {
      const device = visit.deviceType || 'Desconocido';
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      labels: Object.keys(deviceCounts),
      datasets: [{
        label: 'Dispositivos',
        data: Object.values(deviceCounts),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
        ],
        borderWidth: 1,
      }]
    };
  };

  const preparePageData = () => {
    const pageCounts = chartData.visits.reduce((acc, visit) => {
      const page = visit.pageUrl || 'N/A';
      acc[page] = (acc[page] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Ordenar por cantidad de visitas
    const sortedPages = Object.entries(pageCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5); // Top 5 páginas

    return {
      labels: sortedPages.map(([page]) => page.length > 20 ? page.substring(0, 20) + '...' : page),
      datasets: [{
        label: 'Visitas por Página',
        data: sortedPages.map(([,count]) => count),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      }]
    };
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="space-y-8">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Visitas</p>
              <p className="text-3xl font-bold">{chartData.totalVisits}</p>
            </div>
            <div className="text-blue-200 text-4xl">📊</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Usuarios Únicos</p>
              <p className="text-3xl font-bold">{chartData.uniqueUsers}</p>
            </div>
            <div className="text-green-200 text-4xl">👥</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Páginas Únicas</p>
              <p className="text-3xl font-bold">{chartData.uniquePages}</p>
            </div>
            <div className="text-purple-200 text-4xl">🌐</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Tiempo Promedio</p>
              <p className="text-3xl font-bold">{formatTime(chartData.averageTime)}</p>
            </div>
            <div className="text-orange-200 text-4xl">⏱️</div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de línea - Visitas por fecha */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📈 Evolución de Visitas</h3>
          <div className="h-64">
            <Line
              data={prepareTimeSeriesData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1,
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Gráfico de barras - Páginas más visitadas */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📄 Páginas Más Visitadas</h3>
          <div className="h-64">
            <Bar
              data={preparePageData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1,
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Gráfico de dona - Navegadores */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🌐 Navegadores</h3>
          <div className="h-64 flex items-center justify-center">
            <Doughnut
              data={prepareBrowserData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Gráfico de barras - Dispositivos */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📱 Dispositivos</h3>
          <div className="h-64">
            <Bar
              data={prepareDeviceData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
