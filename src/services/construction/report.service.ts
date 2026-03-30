import api from '../../config/api';
import type { B1ReportDto, B3ReportDto, UnitPriceAnalysisDto } from '../../types/construction/report';

// Usamos PascalCase como en el Gateway para evitar errores 400
const BASE_URL = '/api/construction/api/Reports';

export const reportService = {
  // Formulario B-1 (Presupuesto)
  getB1Data: async (projectId: string): Promise<B1ReportDto> => {
    const response = await api.get<B1ReportDto>(`${BASE_URL}/projects/${projectId}/budget`);
    return response.data;
  },

  downloadB1Pdf: async (projectId: string, projectName: string): Promise<void> => {
    const response = await api.get(`${BASE_URL}/projects/${projectId}/budget/pdf`, {
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Formulario_B1_${projectName.replace(/\s+/g, '_')}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  // Formulario B-2 (Análisis de Precio Unitario - Individual por Ítem)
  getB2Data: async (itemId: string): Promise<UnitPriceAnalysisDto> => {
    const response = await api.get<UnitPriceAnalysisDto>(`${BASE_URL}/items/${itemId}/unit-price-analysis`);
    return response.data;
  },

  downloadB2Pdf: async (itemId: string, itemName: string): Promise<void> => {
    const response = await api.get(`${BASE_URL}/items/${itemId}/unit-price-analysis/pdf`, {
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Formulario_B2_${itemName.replace(/\s+/g, '_')}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  // Formulario B-2 (Análisis de Precio Unitario - Masivo Proyecto)
  downloadProjectB2Pdf: async (projectId: string, projectName: string): Promise<void> => {
    const response = await api.get(`${BASE_URL}/projects/${projectId}/unit-price-analysis/pdf`, {
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `APU_Masivo_${projectName.replace(/\s+/g, '_')}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  // Formulario B-3 (Insumos Consolidados)
  getB3Data: async (projectId: string, filter?: string): Promise<B3ReportDto> => {
    const params = filter ? { filter } : {};
    const response = await api.get<B3ReportDto>(`${BASE_URL}/projects/${projectId}/consolidated-resources`, { params });
    return response.data;
  },

  downloadB3Pdf: async (projectId: string, projectName: string, filter?: string): Promise<void> => {
    const params = filter ? { filter } : {};
    const response = await api.get(`${BASE_URL}/projects/${projectId}/consolidated-resources/pdf`, {
      responseType: 'blob',
      params
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    const suffix = filter ? `_${filter}` : '';
    link.setAttribute('download', `Formulario_B3${suffix}_${projectName.replace(/\s+/g, '_')}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
};
