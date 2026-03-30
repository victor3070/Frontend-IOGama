import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { moduleService } from '../../../services/construction/module.service';
import { reportKeys } from './useReports';
import { sileo } from 'sileo';
import Swal from 'sweetalert2';
import type { CreateModuleRequest, UpdateModuleRequest } from '../../../types/construction/module';

export const moduleKeys = {
  all: ['projectModules'] as const,
  list: (projectId: string) => [...moduleKeys.all, 'list', projectId] as const,
};

export const useModulesQuery = (projectId: string) => {
  return useQuery({
    queryKey: moduleKeys.list(projectId),
    queryFn: () => moduleService.getModules(projectId),
    enabled: !!projectId,
  });
};

export const useCreateModuleMutation = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateModuleRequest) => moduleService.createModule(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: moduleKeys.list(projectId) });
      queryClient.invalidateQueries({ queryKey: reportKeys.b1(projectId) });
      sileo.success({ title: 'Módulo añadido', description: 'El capítulo se ha incorporado al presupuesto.' });
    },
    onError: (error: any) => {
      sileo.error({ title: 'Error al crear', description: error.response?.data?.message });
    }
  });
};

export const useUpdateModuleMutation = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateModuleRequest }) => 
      moduleService.updateModule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: moduleKeys.list(projectId) });
      queryClient.invalidateQueries({ queryKey: reportKeys.b1(projectId) });
      sileo.success({ title: 'Módulo actualizado' });
    }
  });
};

export const useDeleteModuleMutation = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => moduleService.deleteModule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: moduleKeys.list(projectId) });
      queryClient.invalidateQueries({ queryKey: reportKeys.b1(projectId) });
      sileo.success({ title: 'Módulo eliminado' });
    }
  });
};
