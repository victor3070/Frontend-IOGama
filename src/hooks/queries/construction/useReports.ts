import { useQuery, useMutation } from '@tanstack/react-query';
import { reportService } from '../../../services/construction/report.service';
import { sileo } from 'sileo';

export const reportKeys = {
  all: ['reports'] as const,
  b1: (id: string) => [...reportKeys.all, 'b1', id] as const,
  b2: (id: string) => [...reportKeys.all, 'b2', id] as const,
  b3: (id: string, filter?: string) => [...reportKeys.all, 'b3', id, filter || 'all'] as const,
};

// Formulario B-1
export const useB1DataQuery = (projectId: string) => {
  return useQuery({
    queryKey: reportKeys.b1(projectId),
    queryFn: () => reportService.getB1Data(projectId),
    enabled: !!projectId,
  });
};

export const useDownloadB1Mutation = () => {
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => reportService.downloadB1Pdf(id, name),
    onSuccess: () => sileo.success({ title: 'Descarga iniciada', description: 'El Formulario B-1 se está generando.' }),
    onError: () => sileo.error({ title: 'Error', description: 'No se pudo generar el PDF del presupuesto.' })
  });
};

// Formulario B-2 (Análisis de Precio Unitario)
export const useB2AnalysisQuery = (itemId: string) => {
  return useQuery({
    queryKey: reportKeys.b2(itemId),
    queryFn: () => reportService.getB2Data(itemId),
    enabled: !!itemId,
  });
};

export const useDownloadB2Mutation = () => {
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => reportService.downloadB2Pdf(id, name),
    onSuccess: () => sileo.success({ title: 'Descarga iniciada', description: 'El Formulario B-2 se está generando.' }),
    onError: () => sileo.error({ title: 'Error', description: 'No se pudo generar el PDF del análisis.' })
  });
};

export const useDownloadProjectB2Mutation = () => {
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => reportService.downloadProjectB2Pdf(id, name),
    onSuccess: () => sileo.success({ title: 'Descarga iniciada', description: 'Se están generando todos los APUs del proyecto.' }),
    onError: () => sileo.error({ title: 'Error', description: 'No se pudo generar el PDF masivo.' })
  });
};

// Formulario B-3 (Insumos Consolidados)
export const useB3DataQuery = (projectId: string, filter?: string) => {
  return useQuery({
    queryKey: reportKeys.b3(projectId, filter),
    queryFn: () => reportService.getB3Data(projectId, filter),
    enabled: !!projectId,
  });
};

export const useDownloadB3Mutation = () => {
  return useMutation({
    mutationFn: ({ id, name, filter }: { id: string; name: string; filter?: string }) => 
      reportService.downloadB3Pdf(id, name, filter),
    onSuccess: () => sileo.success({ title: 'Descarga iniciada', description: 'El Formulario B-3 se está generando.' }),
    onError: () => sileo.error({ title: 'Error', description: 'No se pudo generar el PDF de insumos.' })
  });
};
