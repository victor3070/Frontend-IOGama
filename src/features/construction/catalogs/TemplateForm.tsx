import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, Save, Loader2, Layers, Type, Tag, Ruler, FileText } from 'lucide-react';
import Swal from 'sweetalert2';
import { useCreateTemplateMutation, useUpdateTemplateMutation } from '../../../hooks/queries/construction/useItemTemplates';
import { useUnitsQuery } from '../../../hooks/queries/construction/useUnits';
import type { ItemTemplateDto, CreateItemTemplateRequest } from '../../../types/construction/itemTemplate';

const templateSchema = z.object({
  name: z.string().min(2, 'El nombre es demasiado corto').max(100, 'Máximo 100 caracteres'),
  code: z.string().min(2, 'El código es requerido').max(20, 'Máximo 20 caracteres'),
  description: z.string().max(500, 'Máximo 500 caracteres').optional().or(z.literal('')),
  unitOfMeasureId: z.string().min(1, 'La unidad es requerida'),
});

interface TemplateFormProps {
  template?: ItemTemplateDto;
  onClose: () => void;
}

const TemplateForm: React.FC<TemplateFormProps> = ({ template, onClose }) => {
  const isEditing = !!template;
  const { mutate: createTemplate, isPending: isCreating } = useCreateTemplateMutation();
  const { mutate: updateTemplate, isPending: isUpdating } = useUpdateTemplateMutation();
  const { data: units } = useUnitsQuery();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateItemTemplateRequest>({
    resolver: zodResolver(templateSchema),
  });

  useEffect(() => {
    if (template) {
      reset({
        name: template.name,
        code: template.code,
        description: template.description || '',
        unitOfMeasureId: units?.find(u => u.name === template.unit || u.abbreviation === template.unit)?.id || '',
      });
    }
  }, [template, reset, units]);

  const onSubmit = (data: CreateItemTemplateRequest) => {
    const action = isEditing ? updateTemplate : createTemplate;
    const payload = isEditing ? { id: template!.id, data: { ...data, id: template!.id } } : data;

    action(payload as any, {
      onSuccess: () => {
        Swal.fire({
          title: isEditing ? '¡Actualizado!' : '¡Creado!',
          text: `La plantilla "${data.name}" se ha guardado correctamente.`,
          icon: 'success',
          confirmButtonColor: '#2563eb',
          customClass: { popup: 'rounded-[32px]' }
        });
        onClose();
      },
      onError: (err: any) => {
        const detail = err.response?.data?.message || 'Verifica que el código no esté duplicado.';
        Swal.fire({
          title: 'Error',
          text: detail,
          icon: 'error',
          confirmButtonColor: '#ef4444',
          customClass: { popup: 'rounded-[32px]' }
        });
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 text-left">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg shadow-lg text-white">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              {isEditing ? 'Editar Cabecera' : 'Nueva Plantilla de Actividad'}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Type className="h-4 w-4 text-blue-500" /> Nombre de la Actividad
              </label>
              <input 
                {...register('name')}
                type="text"
                placeholder="Ej. Excavación para Cimientos"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-sm outline-none"
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Tag className="h-4 w-4 text-blue-500" /> Código Técnico
              </label>
              <input 
                {...register('code')}
                type="text"
                placeholder="Ej. EXC-01"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-sm outline-none"
              />
              {errors.code && <p className="text-xs text-red-500">{errors.code.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Ruler className="h-4 w-4 text-blue-500" /> Unidad de Medida
              </label>
              <select 
                {...register('unitOfMeasureId')}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-sm outline-none bg-white"
              >
                <option value="">Selecciona unidad...</option>
                {units?.map(unit => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name} ({unit.abbreviation})
                  </option>
                ))}
              </select>
              {errors.unitOfMeasureId && <p className="text-xs text-red-500">{errors.unitOfMeasureId.message}</p>}
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" /> Descripción / Especificaciones
              </label>
              <textarea 
                {...register('description')}
                rows={3}
                placeholder="Detalla los alcances de esta actividad..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-sm outline-none resize-none"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="px-8 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center gap-2"
            >
              {isCreating || isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isEditing ? 'Guardar Cambios' : 'Crear Plantilla'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TemplateForm;
