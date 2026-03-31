import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Plus, 
  Layers, 
  Loader2, 
  CheckSquare, 
  Square, 
  ArrowRight,
  Info
} from 'lucide-react';
import { useItemTemplatesQuery, useBulkImportMutation } from '../../../hooks/queries/construction/useItemTemplates';
import { useCreateFromTemplateMutation } from '../../../hooks/queries/construction/useItems';
import type { ItemTemplateDto } from '../../../types/construction/itemTemplate';
import Swal from 'sweetalert2';

interface ImportTemplatesModalProps {
  projectId: string;
  moduleId: string;
  moduleName: string;
  onClose: () => void;
}

interface SelectedItem {
  template: ItemTemplateDto;
  quantity: number;
}

const ImportTemplatesModal: React.FC<ImportTemplatesModalProps> = ({ projectId, moduleId, moduleName, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);

  const { data: templates, isLoading } = useItemTemplatesQuery(false);
  const { mutate: importTemplates, isPending } = useBulkImportMutation(projectId);
  const { mutate: createFromTemplate } = useCreateFromTemplateMutation(moduleId, projectId);

  const filteredTemplates = templates?.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelect = (template: ItemTemplateDto) => {
    const isSelected = selectedItems.find(i => i.template.id === template.id);
    if (isSelected) {
      setSelectedItems(prev => prev.filter(i => i.template.id !== template.id));
    } else {
      setSelectedItems(prev => [...prev, { template, quantity: 1 }]);
    }
  };

  const handleQuickCreate = async (template: ItemTemplateDto) => {
    const { value: quantity } = await Swal.fire({
      title: 'Crear Receta APU',
      text: `¿Qué cantidad de "${template.name}" deseas añadir?`,
      input: 'number',
      inputLabel: `Unidad: ${template.unit}`,
      inputValue: 1,
      showCancelButton: true,
      confirmButtonText: 'Crear en Presupuesto',
      confirmButtonColor: '#2563eb',
      customClass: { popup: 'rounded-[32px]' },
      inputValidator: (value) => {
        if (!value || parseFloat(value) <= 0) {
          return 'Debes ingresar una cantidad válida';
        }
      }
    });

    if (quantity) {
      createFromTemplate({
        templateId: template.id,
        moduleId,
        quantity: parseFloat(quantity)
      });
    }
  };

  const updateQuantity = (id: string, qty: number) => {
    setSelectedItems(prev => prev.map(i => 
      i.template.id === id ? { ...i, quantity: Math.max(0, qty) } : i
    ));
  };

  const handleImport = () => {
    if (selectedItems.length === 0) return;

    importTemplates({
      moduleId,
      items: selectedItems.map(i => ({
        templateId: i.template.id,
        quantity: i.quantity
      }))
    }, {
      onSuccess: onClose
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-4 text-left">
            <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-100">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Importar Actividades al Presupuesto</h3>
              <p className="text-sm text-gray-500">Destino: <span className="font-bold text-blue-600">{moduleName}</span></p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Lado Izquierdo: Catálogo */}
          <div className="w-2/3 border-r border-gray-100 flex flex-col p-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Buscar en el catálogo maestro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm bg-gray-50/50"
              />
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {isLoading ? (
                <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {filteredTemplates?.map(template => {
                    const isSelected = selectedItems.some(i => i.template.id === template.id);
                    return (
                      <button 
                        key={template.id}
                        onClick={() => toggleSelect(template)}
                        className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between group ${
                          isSelected ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500' : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          {isSelected ? <CheckSquare className="h-5 w-5 text-blue-600" /> : <Square className="h-5 w-5 text-gray-300" />}
                          <div>
                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-tighter mb-0.5">{template.code}</p>
                            <p className="text-sm font-bold text-gray-900 leading-tight">{template.name}</p>
                            <p className="text-[10px] text-gray-400 font-medium">Unidad: {template.unit}</p>
                          </div>
                        </div>
                        <Plus className={`h-4 w-4 transition-all ${isSelected ? 'rotate-45 text-blue-600' : 'text-gray-300 group-hover:text-blue-400'}`} />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Lado Derecho: Selección y Cantidades */}
          <div className="w-1/3 flex flex-col p-6 bg-gray-50/30">
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              Seleccionados <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full">{selectedItems.length}</span>
            </h4>

            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
              {selectedItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <Info className="h-8 w-8 text-gray-200 mb-2" />
                  <p className="text-xs text-gray-400 italic">No hay ítems seleccionados. Haz clic en las actividades del catálogo para añadirlas.</p>
                </div>
              ) : (
                selectedItems.map(item => (
                  <div key={item.template.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm animate-in slide-in-from-right-2 duration-200">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-xs font-bold text-gray-800 line-clamp-1">{item.template.name}</p>
                      <button onClick={() => toggleSelect(item.template)} className="text-gray-300 hover:text-red-500"><X className="h-3.5 w-3.5" /></button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Cantidad ({item.template.unit})</span>
                      <input 
                        type="number" 
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.template.id, parseFloat(e.target.value) || 0)}
                        className="w-20 px-2 py-1 rounded-lg border border-gray-200 text-right text-xs font-bold text-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-6">
              <button 
                onClick={handleImport}
                disabled={selectedItems.length === 0 || isPending}
                className="w-full flex items-center justify-center gap-3 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 disabled:opacity-50 disabled:grayscale"
              >
                {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
                Importar al Presupuesto
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportTemplatesModal;
