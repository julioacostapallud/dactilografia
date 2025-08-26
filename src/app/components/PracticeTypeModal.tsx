import React, { useState, useEffect } from 'react';
import { apiService, Institucion, Prueba } from '@/lib/api';

interface PracticeTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPractice: (prueba: Prueba) => void;
}

const PracticeTypeModal: React.FC<PracticeTypeModalProps> = ({
  isOpen,
  onClose,
  onSelectPractice
}) => {
  const [instituciones, setInstituciones] = useState<Institucion[]>([]);
  const [pruebas, setPruebas] = useState<Prueba[]>([]);
  const [selectedInstitucion, setSelectedInstitucion] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar instituciones al abrir el modal
  useEffect(() => {
    if (isOpen) {
      loadInstituciones();
    }
  }, [isOpen]);

  // Cargar pruebas cuando se selecciona una institución
  useEffect(() => {
    if (selectedInstitucion) {
      loadPruebas(selectedInstitucion);
    } else {
      setPruebas([]);
    }
  }, [selectedInstitucion]);

  const loadInstituciones = async () => {
    setIsLoading(true);
    setError(null);
    console.log('🔍 Iniciando carga de instituciones...');
    console.log('🌐 API URL:', process.env.NEXT_PUBLIC_API_BASE_URL);
    
    try {
      console.log('📡 Haciendo request a:', `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/instituciones`);
      const data = await apiService.getInstituciones();
      console.log('✅ Instituciones cargadas:', data);
      setInstituciones(data);
    } catch (err) {
      console.error('❌ Error loading instituciones:', err);
      console.error('❌ Error details:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined
      });
      setError('Error al cargar las instituciones');
    } finally {
      setIsLoading(false);
    }
  };

  const loadPruebas = async (institucionId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiService.getPruebas(institucionId);
      setPruebas(data);
    } catch (err) {
      setError('Error al cargar las pruebas');
      console.error('Error loading pruebas:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstitucionChange = (institucionId: number) => {
    setSelectedInstitucion(institucionId);
  };

  const handlePruebaSelect = (prueba: Prueba) => {
    onSelectPractice(prueba);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Seleccionar Tipo de Práctica</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Institución Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Selecciona una Institución:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {instituciones.map((institucion) => (
                <button
                  key={institucion.id}
                  onClick={() => handleInstitucionChange(institucion.id)}
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    selectedInstitucion === institucion.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium">{institucion.nombre}</div>
                  <div className="text-sm text-gray-600">{institucion.provincia}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Pruebas Selection */}
          {selectedInstitucion && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                Selecciona una Prueba:
              </h3>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Cargando pruebas...</p>
                </div>
              ) : pruebas.length > 0 ? (
                <div className="space-y-3">
                  {pruebas.map((prueba) => (
                    <button
                      key={prueba.id}
                      onClick={() => handlePruebaSelect(prueba)}
                      className="w-full p-4 border border-gray-200 rounded-lg text-left hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{prueba.nombre}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            {prueba.institucion_nombre} - {prueba.provincia}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-blue-600">
                            {prueba.minutos} min
                          </div>
                          <div className="text-xs text-gray-500">
                            {prueba.minimo_palabras} palabras mín.
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No hay pruebas disponibles para esta institución.
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">¿Cómo funciona?</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Selecciona la institución donde quieres practicar</li>
              <li>• Elige el tipo de prueba específico</li>
              <li>• Cada prueba tiene su tiempo límite y palabras mínimas</li>
              <li>• Los textos están adaptados al formato de cada institución</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeTypeModal;
