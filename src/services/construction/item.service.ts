import api from '../../config/api';
import type { BudgetItemDto } from '../../types/construction/item';
import type { 
  BudgetItemAnalysisDto, 
  UpdateItemResourceRequest, 
  AddCustomResourceRequest 
} from '../../types/construction/itemAnalysis';

const BASE_URL = '/api/construction/api';

export const itemService = {
  // Gestión de Cabecera de Ítems
  getModuleItems: async (moduleId: string): Promise<BudgetItemDto[]> => {
    const response = await api.get<BudgetItemDto[]>(`${BASE_URL}/modules/${moduleId}/items`);
    return response.data;
  },

  updateItem: async (id: string, data: Partial<BudgetItemDto>): Promise<void> => {
    await api.put(`${BASE_URL}/items/${id}`, data);
  },

  deleteItem: async (id: string): Promise<void> => {
    await api.delete(`${BASE_URL}/items/${id}`);
  },

  // Actualizar recurso en el APU (PUT /api/items/{id}/resources/{resourceId})
  updateItemResource: async (itemId: string, resourceId: string, data: UpdateItemResourceRequest): Promise<void> => {
    await api.put(`${BASE_URL}/items/${itemId}/resources/${resourceId}`, data);
  },

  // Eliminar recurso del APU (DELETE /api/items/{id}/resources/{resourceId})
  removeItemResource: async (itemId: string, resourceId: string): Promise<void> => {
    await api.delete(`${BASE_URL}/items/${itemId}/resources/${resourceId}`);
  }
};
