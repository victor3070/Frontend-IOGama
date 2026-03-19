import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { itemService } from '../../../services/construction/item.service';
import { sileo } from 'sileo';
import type { BudgetItemDto } from '../../../types/construction/item';
import type { 
  UpdateItemResourceRequest, 
  AddCustomResourceRequest 
} from '../../../types/construction/itemAnalysis';

export const itemKeys = {
  all: ['projectItems'] as const,
  list: (moduleId: string) => [...itemKeys.all, 'list', moduleId] as const,
  analysis: (id: string) => [...itemKeys.all, 'analysis', id] as const,
};

export const useModuleItemsQuery = (moduleId: string) => {
  return useQuery({
    queryKey: itemKeys.list(moduleId),
    queryFn: () => itemService.getModuleItems(moduleId),
    enabled: !!moduleId,
  });
};

export const useUpdateItemMutation = (moduleId: string, projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BudgetItemDto> }) => 
      itemService.updateItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemKeys.list(moduleId) });
      queryClient.invalidateQueries({ queryKey: ['projectModules', 'list', projectId] });
      sileo.success({ title: 'Ítem actualizado' });
    },
    onError: (error: any) => {
      sileo.error({ title: 'Error', description: error.response?.data?.message });
    }
  });
};

export const useAddCustomResourceMutation = (itemId: string, moduleId: string, projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddCustomResourceRequest) => 
      itemService.addCustomResource(itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemKeys.analysis(itemId) });
      queryClient.invalidateQueries({ queryKey: itemKeys.list(moduleId) });
      queryClient.invalidateQueries({ queryKey: ['projectModules', 'list', projectId] });
      sileo.success({ title: 'Recurso añadido' });
    }
  });
};

export const useUpdateItemResourceMutation = (itemId: string, moduleId: string, projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ resourceId, data }: { resourceId: string; data: UpdateItemResourceRequest }) => 
      itemService.updateItemResource(itemId, resourceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemKeys.analysis(itemId) });
      queryClient.invalidateQueries({ queryKey: itemKeys.list(moduleId) });
      queryClient.invalidateQueries({ queryKey: ['projectModules', 'list', projectId] });
      sileo.success({ title: 'Análisis actualizado' });
    }
  });
};

export const useDeleteItemResourceMutation = (itemId: string, moduleId: string, projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (resourceId: string) => 
      itemService.removeItemResource(itemId, resourceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemKeys.analysis(itemId) });
      queryClient.invalidateQueries({ queryKey: itemKeys.list(moduleId) });
      queryClient.invalidateQueries({ queryKey: ['projectModules', 'list', projectId] });
      sileo.success({ title: 'Recurso eliminado' });
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
      sileo.success({ title: 'Ítem eliminado' });
    }
  });
};
