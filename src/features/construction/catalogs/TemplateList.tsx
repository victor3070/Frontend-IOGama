import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Loader2,
  MoreVertical,
  Globe,
  ArrowRight,
  BookOpen,
  ClipboardList
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useItemTemplatesQuery, useDeleteTemplateMutation } from '../../../hooks/queries/construction/useItemTemplates';
import TemplateForm from './TemplateForm';
import type { ItemTemplateDto } from '../../../types/construction/itemTemplate';

const TemplateList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ItemTemplateDto | undefined>(undefined);

  const { data: templates, isLoading } = useItemTemplatesQuery(false);
  const { mutate: deleteTemplate } = useDeleteTemplateMutation();

  const filteredTemplates = templates?.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditHeader = (template: ItemTemplateDto) => {
    setSelectedTemplate(template);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    Swal.fire({
      title: '¿Eliminar plantilla?',
      text: `Se eliminará "${name}" y toda su configuración de insumos.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      customClass: { popup: 'rounded-[32px]' }
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTemplate(id);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-medium">Cargando maestro de plantillas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-left">
        <div className="flex items-center gap-4 text-left">
          <div className="bg-blue-50 p-3 rounded-xl">
            <Layers className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Maestro de Plantillas (APU)</h2>
            <p className="text-sm text-gray-500">Define las recetas estándar de actividades para tus presupuestos.</p>
          </div>
        </div>
        <button 
          onClick={() => { setSelectedTemplate(undefined); setIsFormOpen(true); }}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
        >
          <Plus className="h-4 w-4" />
          Nueva Actividad
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
        <input 
          type="text" 
          placeholder="Buscar plantilla por nombre o código..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-sm bg-white outline-none"
        />
      </div>

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates?.length === 0 ? (
          <div className="col-span-full py-12 bg-white rounded-2xl border border-dashed border-gray-200 text-center text-gray-400">
            No se encontraron plantillas maestro.
          </div>
        ) : (
          filteredTemplates?.map((template) => (
            <div key={template.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden flex flex-col">
              <div className="p-6 flex-1 text-left">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">{template.code}</span>
                    <h3 className="font-bold text-gray-900 line-clamp-2 leading-tight h-10">{template.name}</h3>
                  </div>
                  {template.isGlobal ? (
                    <Globe className="h-4 w-4 text-amber-400 shrink-0" title="Plantilla Global" />
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-blue-500 shrink-0" title="Plantilla Propia" />
                  )}
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase font-bold">Unidad</span>
                    <span className="text-sm font-medium text-gray-700">{template.unit}</span>
                  </div>
                  <div className="h-8 w-px bg-gray-100" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase font-bold">Recursos</span>
                    <span className="text-sm font-medium text-gray-700">{template.resourceCount} asignados</span>
                  </div>
                </div>

                <p className="text-xs text-gray-500 line-clamp-2 italic">
                  {template.description || 'Sin descripción adicional.'}
                </p>
              </div>

              <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
                <button 
                  onClick={() => navigate(`/construction/templates/${template.id}/edit`)}
                  className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Configurar Receta <ArrowRight className="h-3 w-3" />
                </button>
                
                <div className="flex items-center gap-1">
                  {!template.isGlobal && (
                    <>
                      <button 
                        onClick={() => handleEditHeader(template)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(template.id, template.name)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isFormOpen && (
        <TemplateForm 
          template={selectedTemplate} 
          onClose={() => setIsFormOpen(false)} 
        />
      )}
    </div>
  );
};

export default TemplateList;
