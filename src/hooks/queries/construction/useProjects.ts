import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService } from '../../../services/construction/project.service';
import { sileo } from 'sileo';
import Swal from 'sweetalert2';
import type { CreateProjectRequest, UpdateProjectRequest } from '../../../types/construction/project';
import type { ProjectParametersDto, UpdateProjectParametersRequest } from '../../../types/construction/projectParameters';

export const projectKeys = {
  all: ['projects'] as const,
  list: () => [...projectKeys.all, 'list'] as const,
  detail: (id: string) => [...projectKeys.all, 'detail', id] as const,
  parameters: (id: string) => [...projectKeys.all, 'parameters', id] as const,
};

export const useProjectsQuery = () => {
  return useQuery({
    queryKey: projectKeys.list(),
    queryFn: projectService.getProjects,
  });
};

export const useProjectByIdQuery = (id: string) => {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => projectService.getProjectById(id),
    enabled: !!id,
  });
};

export const useProjectParametersQuery = (projectId: string) => {
  return useQuery({
    queryKey: projectKeys.parameters(projectId),
    queryFn: () => projectService.getProjectParameters(projectId),
    enabled: !!projectId,
  });
};

export const useCreateProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectRequest) => projectService.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      Swal.fire({
        title: '¡Proyecto Registrado!',
        text: 'La nueva obra ha sido dada de alta exitosamente.',
        icon: 'success',
        confirmButtonColor: '#2563eb',
        customClass: { popup: 'rounded-[32px]' }
      });
    },
    onError: (error: any) => {
      const serverErrors = error.response?.data?.errors;
      let errorMessage = 'Hubo un problema al procesar la solicitud.';

      if (serverErrors) {
        errorMessage = Object.values(serverErrors).flat().join('<br/>');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      Swal.fire({
        title: 'Error de Validación',
        html: `<div class="text-left text-sm text-red-600">${errorMessage}</div>`,
        icon: 'error',
        confirmButtonColor: '#ef4444',
        customClass: { popup: 'rounded-[32px]' }
      });
    }
  });
};

export const useUpdateProjectParametersMutation = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProjectParametersRequest) => 
      projectService.updateProjectParameters(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.parameters(projectId) });
      Swal.fire({
        title: '¡Parámetros Guardados!',
        text: 'Los coeficientes impositivos se han actualizado correctamente.',
        icon: 'success',
        confirmButtonColor: '#2563eb',
        customClass: { popup: 'rounded-[32px]' }
      });
    },
    onError: (error: any) => {
      console.error('Error al guardar parámetros:', error.response?.data);
      Swal.fire({
        title: 'Error al Guardar',
        text: error.response?.data?.message || 'No se pudieron sincronizar los parámetros con el servidor.',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        customClass: { popup: 'rounded-[32px]' }
      });
    }
  });
};

export const useUpdateProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectRequest }) => 
      projectService.updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      sileo.success({ title: 'Proyecto Actualizado' });
    },
    onError: (error: any) => {
      sileo.error({ title: 'Error', description: error.response?.data?.message });
    }
  });
};

export const useDeleteProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => projectService.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      sileo.success({ title: 'Proyecto Eliminado' });
    }
  });
};
