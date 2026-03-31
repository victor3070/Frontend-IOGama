import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { itemService } from '../../../services/construction/item.service';
import { reportKeys } from './useReports';
import { sileo } from 'sileo';
import type { 
  BudgetItemDto, 
  UpdateBudgetItemRequest, 
  CreateBudgetItemRequest,
  BulkImportRequest
} from '../../../types/construction/item';
import type { 
  UpdateItemResourceRequest, 
  AddCustomResourceRequest,
  ImportResourcesRequest
} from '../../../types/construction/itemAnalysis';

export const itemKeys = {
  all: ['projectItems'] as const,
  list: (moduleId: string) => [...itemKeys.all, 'list', moduleId] as const,
};

export const useModuleItemsQuery = (moduleId: string) => {
  return useQuery({
    queryKey: itemKeys.list(moduleId),
    queryFn: () => itemService.getModuleItems(moduleId),
    enabled: !!moduleId,
  });
};

export const useCreateItemMutation = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBudgetItemRequest) => 
      itemService.createItem(data.moduleId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: itemKeys.list(variables.moduleId) });
      queryClient.invalidateQueries({ queryKey: ['projectModules', 'list', projectId] });
      queryClient.invalidateQueries({ queryKey: reportKeys.b1(projectId) });
      sileo.success({ title: 'Ítem añadido' });
    },
    onError: (error: any) => {
      sileo.error({ title: 'Error', description: error.response?.data?.message || 'No se pudo crear el ítem' });
    }
  });
};

export const useImportItemsMutation = (moduleId: string, projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkImportRequest) => 
      itemService.importItems(moduleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemKeys.list(moduleId) });
      queryClient.invalidateQueries({ queryKey: ['projectModules', 'list', projectId] });
      queryClient.invalidateQueries({ queryKey: reportKeys.b1(projectId) });
      sileo.success({ title: 'Ítems importados' });
    },
    onError: (error: any) => {
      sileo.error({ title: 'Error', description: error.response?.data?.message });
    }
  });
};

export const useUpdateItemMutation = (moduleId: string, projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBudgetItemRequest }) => 
      itemService.updateItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemKeys.list(moduleId) });
      queryClient.invalidateQueries({ queryKey: ['projectModules', 'list', projectId] });
      queryClient.invalidateQueries({ queryKey: reportKeys.b1(projectId) });
      sileo.success({ title: 'Ítem actualizado' });
    },
    onError: (error: any) => {
      sileo.error({ title: 'Error', description: error.response?.data?.message });
    }
  });
};

export const useCreateFromTemplateMutation = (moduleId: string, projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { templateId: string; moduleId: string; quantity: number }) => 
      itemService.createItemFromTemplate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemKeys.list(moduleId) });
      queryClient.invalidateQueries({ queryKey: ['projectModules', 'list', projectId] });
      queryClient.invalidateQueries({ queryKey: reportKeys.b1(projectId) });
      sileo.success({ title: 'Receta APU añadida' });
    },
    onError: (error: any) => {
      sileo.error({ title: 'Error', description: error.response?.data?.message });
    }
  });
};

export const useImportResourcesMutation = (itemId: string, moduleId: string, projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ImportResourcesRequest) => 
      itemService.importResources(itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.b2(itemId) });
      queryClient.invalidateQueries({ queryKey: reportKeys.b1(projectId) });
      queryClient.invalidateQueries({ queryKey: itemKeys.list(moduleId) });
      queryClient.invalidateQueries({ queryKey: ['projectModules', 'list', projectId] });
      sileo.success({ title: 'Insumos importados al análisis' });
    },
    onError: (error: any) => {
      sileo.error({ title: 'Error', description: error.response?.data?.message || 'No se pudieron importar los recursos' });
    }
  });
};

export const useAddCustomResourceMutation = (itemId: string, moduleId: string, projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddCustomResourceRequest) => 
      itemService.addCustomResource(itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.b2(itemId) });
      queryClient.invalidateQueries({ queryKey: reportKeys.b1(projectId) });
      queryClient.invalidateQueries({ queryKey: itemKeys.list(moduleId) });
      queryClient.invalidateQueries({ queryKey: ['projectModules', 'list', projectId] });
      sileo.success({ title: 'Recurso añadido' });
    },
    onError: (error: any) => {
      sileo.error({ title: 'Error', description: error.response?.data?.message || 'No se pudo añadir el recurso' });
    }
  });
};

export const useUpdateItemResourceMutation = (itemId: string, moduleId: string, projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ resourceId, data }: { resourceId: string; data: UpdateItemResourceRequest }) => 
      itemService.updateItemResource(itemId, resourceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.b2(itemId) });
      queryClient.invalidateQueries({ queryKey: reportKeys.b1(projectId) });
      queryClient.invalidateQueries({ queryKey: itemKeys.list(moduleId) });
      queryClient.invalidateQueries({ queryKey: ['projectModules', 'list', projectId] });
      sileo.success({ title: 'Análisis actualizado' });
    },
    onError: (error: any) => {
      sileo.error({ title: 'Error', description: error.response?.data?.message || 'No se pudo actualizar el recurso' });
    }
  });
};

export const useDeleteItemResourceMutation = (itemId: string, moduleId: string, projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (resourceId: string) => 
      itemService.removeItemResource(itemId, resourceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.b2(itemId) });
      queryClient.invalidateQueries({ queryKey: reportKeys.b1(projectId) });
      queryClient.invalidateQueries({ queryKey: itemKeys.list(moduleId) });
      queryClient.invalidateQueries({ queryKey: ['projectModules', 'list', projectId] });
      sileo.success({ title: 'Recurso eliminado' });
    },
    onError: (error: any) => {
      sileo.error({ title: 'Error', description: error.response?.data?.message || 'No se pudo eliminar el recurso' });
    }
  });
};

export const useDeleteItemMutation = (moduleId: string, projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => itemService.deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemKeys.list(moduleId) });
      queryClient.invalidateQueries({ queryKey: ['projectModules', 'list', projectId] });
      queryClient.invalidateQueries({ queryKey: reportKeys.b1(projectId) });
      sileo.success({ title: 'Ítem eliminado' });
    }
  });
};
