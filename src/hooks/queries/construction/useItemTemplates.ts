import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { itemTemplateService } from '../../../services/construction/itemTemplate.service';
import { sileo } from 'sileo';
import Swal from 'sweetalert2';
import type { 
  CreateItemTemplateRequest, 
  UpdateItemTemplateRequest,
  TemplateResourceRequest 
} from '../../../types/construction/itemTemplate';
import type { BulkImportRequest } from '../../../types/construction/item';

export const templateKeys = {
  all: ['itemTemplates'] as const,
  list: (filter: boolean) => [...templateKeys.all, 'list', filter] as const,
  detail: (id: string) => [...templateKeys.all, 'detail', id] as const,
};

export const useItemTemplatesQuery = (onlyMyTenant = false) => {
  return useQuery({
    queryKey: templateKeys.list(onlyMyTenant),
    queryFn: () => itemTemplateService.getTemplates(onlyMyTenant),
  });
};

export const useTemplateByIdQuery = (id: string) => {
  return useQuery({
    queryKey: templateKeys.detail(id),
    queryFn: () => itemTemplateService.getTemplateById(id),
    enabled: !!id,
  });
};

export const useCreateTemplateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateItemTemplateRequest) => itemTemplateService.createTemplate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.all });
      sileo.success({ title: 'Plantilla Creada' });
    },
    onError: (error: any) => {
      sileo.error({ title: 'Error', description: error.response?.data?.message });
    }
  });
};

export const useUpdateTemplateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateItemTemplateRequest }) => 
      itemTemplateService.updateTemplate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.all });
      sileo.success({ title: 'Plantilla Actualizada' });
    }
  });
};

export const useBulkImportMutation = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkImportRequest) => itemTemplateService.bulkImportTemplates(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectModules', 'list', projectId] });
      queryClient.invalidateQueries({ queryKey: ['projectItems'] });
      
      Swal.fire({
        title: '¡Importación Exitosa!',
        text: 'Las actividades han sido añadidas al presupuesto de la obra.',
        icon: 'success',
        confirmButtonColor: '#2563eb',
        customClass: { popup: 'rounded-[32px]' }
      });
    },
    onError: (error: any) => {
      sileo.error({ 
        title: 'Error en importación', 
        description: error.response?.data?.message || 'No se pudieron importar los ítems.' 
      });
    }
  });
};

export const useAddTemplateResourcesMutation = (templateId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (resources: TemplateResourceRequest[]) => 
      itemTemplateService.addResources(templateId, resources),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.all });
    },
    onError: (error: any) => {
      const serverDetail = error.response?.data || 'Error al actualizar recursos.';
      sileo.error({ title: 'Error', description: typeof serverDetail === 'string' ? serverDetail : 'Error interno.' });
    }
  });
};

export const useRemoveTemplateResourcesMutation = (templateId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (resourceIds: string[]) => 
      itemTemplateService.removeResources(templateId, resourceIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.all });
    }
  });
};

export const useDeleteTemplateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => itemTemplateService.deleteTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.all });
      sileo.success({ title: 'Eliminado' });
    }
  });
};
