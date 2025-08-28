'use client';

import { useState, useEffect } from 'react';
import { FaTimes, FaList, FaCog } from 'react-icons/fa';
import { apiService, Prueba, Institucion } from '@/lib/api';

interface PracticeTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPractice: (prueba: Prueba) => void;
  onCustomPractice: (config: {
    texto: string;
    objetivoPalabras: number;
    minutos: number;
  }) => void;
}

export default function PracticeTypeModal({ 
  isOpen, 
  onClose, 
  onSelectPractice, 
  onCustomPractice 
}: PracticeTypeModalProps) {
  const [activeTab, setActiveTab] = useState<'select' | 'custom'>('select');
  const [instituciones, setInstituciones] = useState<Institucion[]>([]);
  const [pruebas, setPruebas] = useState<Prueba[]>([]);
  const [selectedInstitucionId, setSelectedInstitucionId] = useState<number | null>(null);
  const [selectedPruebaId, setSelectedPruebaId] = useState<number | null>(null);
  
  // Campos para práctica personalizada
  const [customText, setCustomText] = useState('');
  const [customObjetivoPalabras, setCustomObjetivoPalabras] = useState(30);
  const [customMinutos, setCustomMinutos] = useState(1);

  // Cargar instituciones al montar el componente
  useEffect(() => {
    loadInstituciones();
  }, []);

  // Cargar pruebas cuando se selecciona una institución
  useEffect(() => {
    if (selectedInstitucionId) {
      loadPruebas(selectedInstitucionId);
    } else {
      setPruebas([]);
    }
  }, [selectedInstitucionId]);



  const loadInstituciones = async () => {
    try {
      const data = await apiService.getInstituciones();
      setInstituciones(data);
    } catch (error) {
      console.error('Error cargando instituciones:', error);
    }
  };

  const loadPruebas = async (institucionId: number) => {
    try {
      const data = await apiService.getPruebas(institucionId);
      setPruebas(data);
    } catch (error) {
      console.error('Error cargando pruebas:', error);
    }
  };

  const handleInstitucionChange = (institucionId: number) => {
    setSelectedInstitucionId(institucionId);
    setSelectedPruebaId(null);
  };

  const handlePruebaChange = (pruebaId: number) => {
    setSelectedPruebaId(pruebaId);
  };

  const handleSelectPractice = () => {
    if (selectedPruebaId) {
      const prueba = pruebas.find(p => p.id === selectedPruebaId);
      if (prueba) {
        onSelectPractice(prueba);
        onClose();
      }
    }
  };

  const handleCustomPractice = () => {
    if (customText.trim() && customObjetivoPalabras > 0 && customMinutos > 0) {
      onCustomPractice({
        texto: customText.trim(),
        objetivoPalabras: customObjetivoPalabras,
        minutos: customMinutos
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-2xl border-2 border-gray-200 max-w-2xl w-full animate-in slide-in-from-bottom-4 duration-300" style={{ maxWidth: '600px' }}>
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
            <span className="text-sm font-semibold text-orange-200">Tipo de Práctica</span>
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
          {/* Tabs */}
        <div className="flex mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('select')}
            className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
              activeTab === 'select'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FaList size={16} />
            Seleccionar Prueba
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
              activeTab === 'custom'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FaCog size={16} />
            Práctica Personalizada
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'select' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Institución
              </label>
              <select
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                value={selectedInstitucionId || ''}
                onChange={(e) => handleInstitucionChange(Number(e.target.value))}
              >
                <option value="">Selecciona una institución</option>
                {instituciones.map((institucion) => (
                  <option key={institucion.id} value={institucion.id}>
                    {institucion.nombre} - {institucion.provincia}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prueba
              </label>
              <select
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                value={selectedPruebaId || ''}
                onChange={(e) => handlePruebaChange(Number(e.target.value))}
                disabled={!selectedInstitucionId}
              >
                <option value="">Selecciona una prueba</option>
                {pruebas.map((prueba) => (
                  <option key={prueba.id} value={prueba.id}>
                    {prueba.nombre} ({prueba.minutos}min - {prueba.minimo_palabras} palabras)
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleSelectPractice}
              disabled={!selectedPruebaId}
              className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 px-4 rounded-lg font-bold hover:from-green-500 hover:to-green-400 disabled:from-green-300 disabled:to-green-400 disabled:opacity-50 transition-all duration-200 shadow-md disabled:shadow-none"
            >
              Seleccionar Prueba
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Texto para practicar
              </label>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Escribe o pega el texto que quieres practicar..."
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 resize-none"
                rows={6}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Objetivo de palabras
                </label>
                <input
                  type="number"
                  value={customObjetivoPalabras}
                  onChange={(e) => setCustomObjetivoPalabras(Number(e.target.value))}
                  min="1"
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiempo (minutos)
                </label>
                <input
                  type="number"
                  value={customMinutos}
                  onChange={(e) => setCustomMinutos(Number(e.target.value))}
                  min="1"
                  max="60"
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                />
              </div>
            </div>

            <button
              onClick={handleCustomPractice}
              disabled={!customText.trim() || customObjetivoPalabras <= 0 || customMinutos <= 0}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-lg font-bold hover:from-orange-400 hover:to-orange-500 disabled:from-orange-300 disabled:to-orange-400 disabled:opacity-50 transition-all duration-200 shadow-md disabled:shadow-none"
            >
              Iniciar Práctica Personalizada
            </button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
