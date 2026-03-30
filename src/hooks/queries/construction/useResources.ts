import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resourceService } from '../../../services/construction/resource.service';
import Swal from 'sweetalert2';
import type { CreateResourceRequest, UpdateResourceRequest } from '../../../types/construction/resource';

export const resourceKeys = {
  all: ['resources'] as const,
  list: (page: number, size: number, type?: string, onlyMyTenant?: boolean) => 
    [...resourceKeys.all, 'list', { page, size, type, onlyMyTenant }] as const,
  search: (term: string, page: number, size: number) => 
    [...resourceKeys.all, 'search', { term, page, size }] as const,
};

export const useResourcesQuery = (pageNumber = 1, pageSize = 10, type?: string, onlyMyTenant = false) => {
  return useQuery({
    queryKey: resourceKeys.list(pageNumber, pageSize, type, onlyMyTenant),
    queryFn: () => resourceService.getResources(pageNumber, pageSize, type, onlyMyTenant),
    placeholderData: (previousData) => previousData,
  });
};

export const useSearchResourcesQuery = (searchTerm: string, pageNumber = 1, pageSize = 10) => {
  return useQuery({
    queryKey: resourceKeys.search(searchTerm, pageNumber, pageSize),
    queryFn: () => resourceService.searchResources(searchTerm, pageNumber, pageSize),
    enabled: searchTerm.length > 2,
    placeholderData: (previousData) => previousData,
  });
};

export const useCreateResourceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateResourceRequest) => resourceService.createResource(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resourceKeys.all });
      Swal.fire({
        title: '¡Recurso Creado!',
        text: 'El nuevo insumo ha sido añadido al catálogo maestro.',
        icon: 'success',
        confirmButtonColor: '#2563eb',
        customClass: { popup: 'rounded-[32px]' }
      });
    },
    onError: (error: any) => {
      const serverErrors = error.response?.data?.errors;
      let msg = 'No se pudo crear el recurso.';
      if (serverErrors) msg = Object.values(serverErrors).flat().join('<br/>');
      
      Swal.fire({ 
        title: 'Error de Registro', 
        html: `<div class="text-left text-sm text-red-600">${msg}</div>`, 
        icon: 'error',
        confirmButtonColor: '#ef4444',
        customClass: { popup: 'rounded-[32px]' }
      });
    }
  });
};

export const useUpdateResourceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateResourceRequest }) => 
      resourceService.updateResource(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resourceKeys.all });
      Swal.fire({
        title: '¡Actualizado!',
        text: 'Los cambios del insumo se han guardado correctamente.',
        icon: 'success',
        confirmButtonColor: '#2563eb',
        customClass: { popup: 'rounded-[32px]' }
      });
    },
    onError: (error: any) => {
      Swal.fire({
        title: 'Error al actualizar',
        text: error.response?.data?.message || 'No se pudieron guardar los cambios.',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        customClass: { popup: 'rounded-[32px]' }
      });
    }
  });
};

export const useDeleteResourceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => resourceService.deleteResource(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resourceKeys.all });
      Swal.fire({
        title: 'Eliminado',
        text: 'El recurso ha sido removido del catálogo maestro.',
        icon: 'success',
        confirmButtonColor: '#2563eb',
        customClass: { popup: 'rounded-[32px]' }
      });
    },
    onError: (error: any) => {
      Swal.fire({
        title: 'Error al eliminar',
        text: error.response?.data?.message || 'No se pudo procesar la eliminación.',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        customClass: { popup: 'rounded-[32px]' }
      });
    }
  });
};
