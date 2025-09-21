import { API_BASE_URL } from './config';

export interface Ejercicio {
  id: number;
  titulo: string;
  descripcion: string;
  texto: string;
  dificultad: string;
  categoria: string;
  created_at: string;
  updated_at: string;
}

export interface Institucion {
  id: number;
  nombre: string;
  provincia: string;
  created_at: string;
}

export interface Prueba {
  id: number;
  institucion_id: number;
  nombre: string;
  minutos: number;
  minimo_palabras: number;
  created_at: string;
  institucion_nombre?: string;
  provincia?: string;
}

export interface TextoPrueba {
  id: number;
  prueba_id: number;
  texto: string;
  created_at: string;
  prueba_nombre?: string;
  minutos?: number;
  minimo_palabras?: number;
  institucion_nombre?: string;
}

export interface EjerciciosResponse {
  ejercicios: Ejercicio[];
  total: number;
}

export interface PageVisit {
  id: number;
  pageUrl: string;
  referrerUrl?: string;
  ipAddress?: string;
  deviceType?: string;
  browser?: string;
  os?: string;
  sessionId?: string;
  visitStart: string;
  visitEnd?: string;
  timeOnPageSeconds?: number;
  userId?: string;
}

export interface VisitsResponse {
  visits: PageVisit[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  async getEjercicios(dificultad?: string, categoria?: string): Promise<EjerciciosResponse> {
    const params = new URLSearchParams();
    if (dificultad) params.append('dificultad', dificultad);
    if (categoria) params.append('categoria', categoria);

    const response = await fetch(`${this.baseUrl}/api/ejercicios?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Error al obtener ejercicios: ${response.status}`);
    }

    return response.json();
  }

  async getEjercicioAleatorio(dificultad?: string, categoria?: string): Promise<Ejercicio | null> {
    try {
      const response = await this.getEjercicios(dificultad, categoria);
      
      if (response.ejercicios.length === 0) {
        return null;
      }

      // Seleccionar un ejercicio aleatorio
      const randomIndex = Math.floor(Math.random() * response.ejercicios.length);
      return response.ejercicios[randomIndex];
    } catch (error) {
      console.error('Error al obtener ejercicio aleatorio:', error);
      return null;
    }
  }

  async guardarResultado(resultado: {
    usuario_id: string;
    ejercicio_id: number;
    velocidad_wpm: number;
    precision_porcentaje: number;
    tiempo_segundos: number;
    errores: number;
  }) {
    const response = await fetch(`${this.baseUrl}/api/resultados`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resultado),
    });

    if (!response.ok) {
      throw new Error(`Error al guardar resultado: ${response.status}`);
    }

    return response.json();
  }

  // ========================================
  // MÉTODOS PARA INSTITUCIONES
  // ========================================

  async getInstituciones(): Promise<Institucion[]> {
    console.log('🔗 API Service - getInstituciones iniciado');
    console.log('🔗 Base URL:', this.baseUrl);
    const url = `${this.baseUrl}/api/instituciones`;
    console.log('🔗 URL completa:', url);
    
    try {
      const response = await fetch(url);
      console.log('🔗 Response status:', response.status);
      console.log('🔗 Response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔗 Error response text:', errorText);
        throw new Error(`Error al obtener instituciones: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('🔗 Response data:', data);
      return data.instituciones || [];
    } catch (error) {
      console.error('🔗 Fetch error:', error);
      throw error;
    }
  }

  // ========================================
  // MÉTODOS PARA PRUEBAS
  // ========================================

  async getPruebas(institucionId?: number): Promise<Prueba[]> {
    const url = institucionId 
      ? `${this.baseUrl}/api/pruebas?institucion_id=${institucionId}`
      : `${this.baseUrl}/api/pruebas`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error al obtener pruebas: ${response.status}`);
    }

    const data = await response.json();
    return data.pruebas || [];
  }

  // ========================================
  // MÉTODOS PARA TEXTOS DE PRUEBA
  // ========================================

  async getTextosPrueba(pruebaId?: number, random: boolean = false): Promise<TextoPrueba[]> {
    const params = new URLSearchParams();
    if (pruebaId) params.append('prueba_id', pruebaId.toString());
    if (random) params.append('random', 'true');
    
    const response = await fetch(`${this.baseUrl}/api/textos-prueba?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Error al obtener textos de prueba: ${response.status}`);
    }

    const data = await response.json();
    return data.textos || [];
  }

  async getTextoPruebaAleatorio(pruebaId?: number): Promise<TextoPrueba | null> {
    try {
      const textos = await this.getTextosPrueba(pruebaId, true);
      return textos.length > 0 ? textos[0] : null;
    } catch (error) {
      console.error('Error al obtener texto de prueba aleatorio:', error);
      return null;
    }
  }

  // ========================================
  // MÉTODOS PARA VISITAS
  // ========================================

  async getVisits(page: number = 1, limit: number = 50): Promise<VisitsResponse> {
    const response = await fetch(`${this.baseUrl}/api/visits?page=${page}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`Error al obtener visitas: ${response.status}`);
    }

    return response.json();
  }

  async registerVisit(visitData: {
    pageUrl: string;
    referrerUrl?: string;
    userId?: string;
  }): Promise<{ success: boolean; visitId?: number; message: string }> {
    const response = await fetch(`${this.baseUrl}/api/visits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(visitData),
    });

    if (!response.ok) {
      throw new Error(`Error al registrar visita: ${response.status}`);
    }

    return response.json();
  }

  async updateVisitTime(visitId: number, timeOnPageSeconds: number): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${this.baseUrl}/api/visits`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        visitId,
        timeOnPageSeconds
      }),
    });

    if (!response.ok) {
      throw new Error(`Error al actualizar tiempo de visita: ${response.status}`);
    }

    return response.json();
  }
}

export const apiService = new ApiService();

