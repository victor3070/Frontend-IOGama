import api from '../../config/api';
import type { 
  BudgetItemDto, 
  CreateBudgetItemRequest, 
  UpdateBudgetItemRequest, 
  BulkImportRequest 
} from '../../types/construction/item';
import type { 
  UpdateItemResourceRequest, 
  AddCustomResourceRequest,
  ImportResourcesRequest 
} from '../../types/construction/itemAnalysis';

const BASE_URL = '/api/construction/api';

export const itemService = {
  // Gestión de Cabecera de Ítems
  getModuleItems: async (moduleId: string): Promise<BudgetItemDto[]> => {
    const response = await api.get<BudgetItemDto[]>(`${BASE_URL}/Modules/${moduleId}/Items`);
    return response.data;
  },

  createItem: async (moduleId: string, data: CreateBudgetItemRequest): Promise<string> => {
    const response = await api.post<string>(`${BASE_URL}/Modules/${moduleId}/Items`, data);
    return response.data;
  },

  importItems: async (moduleId: string, data: BulkImportRequest): Promise<void> => {
    await api.post(`${BASE_URL}/Modules/${moduleId}/Items/Import`, data);
  },

  createItemFromTemplate: async (data: { templateId: string; moduleId: string; quantity: number }): Promise<void> => {
    await api.post(`${BASE_URL}/Items/FromTemplate`, data);
  },

  updateItem: async (id: string, data: UpdateBudgetItemRequest): Promise<void> => {
    await api.put(`${BASE_URL}/Items/${id}`, data);
  },

  deleteItem: async (id: string): Promise<void> => {
    await api.delete(`${BASE_URL}/Items/${id}`);
  },

  // Gestión de Recursos en APU
  addCustomResource: async (itemId: string, data: AddCustomResourceRequest): Promise<void> => {
    await api.post(`${BASE_URL}/items/${itemId}/resources/custom`, data);
  },

  importResources: async (itemId: string, data: ImportResourcesRequest): Promise<void> => {
    await api.post(`${BASE_URL}/items/${itemId}/resources/import`, data);
  },

  updateItemResource: async (itemId: string, resourceId: string, data: UpdateItemResourceRequest): Promise<void> => {
    await api.put(`${BASE_URL}/items/${itemId}/resources/${resourceId}`, data);
  },

  removeItemResource: async (itemId: string, resourceId: string): Promise<void> => {
    await api.delete(`${BASE_URL}/items/${itemId}/resources/${resourceId}`);
  }
};
