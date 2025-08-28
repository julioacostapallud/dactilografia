'use client';

import { useState } from 'react';
import { FaEye, FaUsers, FaChartLine, FaCog, FaChartBar } from 'react-icons/fa';
import VisitsTab from './VisitsTab';
import VisitsCharts from './VisitsCharts';

type TabType = 'visits' | 'charts' | 'users' | 'analytics' | 'settings';

interface Tab {
  id: TabType;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

export default function AdminTabs() {
  const [activeTab, setActiveTab] = useState<TabType>('charts');

  const tabs: Tab[] = [
    {
      id: 'charts',
      label: 'Gráficos',
      icon: <FaChartBar className="w-4 h-4" />,
      component: <VisitsCharts />
    },
    {
      id: 'visits',
      label: 'Visitas',
      icon: <FaEye className="w-4 h-4" />,
      component: <VisitsTab />
    },
    {
      id: 'users',
      label: 'Usuarios',
      icon: <FaUsers className="w-4 h-4" />,
      component: <div className="p-6 text-center text-gray-500">Próximamente: Gestión de usuarios</div>
    },
    {
      id: 'analytics',
      label: 'Analíticas',
      icon: <FaChartLine className="w-4 h-4" />,
      component: <div className="p-6 text-center text-gray-500">Próximamente: Análisis detallado</div>
    },
    {
      id: 'settings',
      label: 'Configuración',
      icon: <FaCog className="w-4 h-4" />,
      component: <div className="p-6 text-center text-gray-500">Próximamente: Configuración del sistema</div>
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200
                ${activeTab === tab.id
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {tabs.find(tab => tab.id === activeTab)?.component}
      </div>
    </div>
  );
}
