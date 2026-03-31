import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Plus, 
  Package, 
  Loader2, 
  CheckSquare, 
  Square
} from 'lucide-react';
import { useResourcesQuery } from '../../../hooks/queries/construction/useResources';
import type { ResourceDto } from '../../../types/construction/resource';

interface ImportResourcesModalProps {
  typeFilter: string; // "Materiales", "Obreros", "Equipos"
  onClose: () => void;
  onImport: (resources: { resourceId: string, performance: number }[]) => void;
  isPending?: boolean;
}

const ImportResourcesModal: React.FC<ImportResourcesModalProps> = ({ 
  typeFilter, 
  onClose, 
  onImport,
  isPending 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // useResourcesQuery(pageNumber = 1, pageSize = 10, type?: string, onlyMyTenant = false)
  const getBackendType = (type: string) => {
    if (type === 'Obreros' || type === 'Mano de Obra') return 'Obreros';
    if (type === 'Equipos' || type.includes('Equipo')) return 'Equipos';
    if (type === 'Materiales') return 'Materiales';
    return type;
  };

  const { data: resourcesData, isLoading } = useResourcesQuery(
    1, 
    50, 
    getBackendType(typeFilter)
  );

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleConfirm = () => {
    const resources = Array.from(selectedIds).map(id => ({
      resourceId: id,
      performance: 1 // Rendimiento por defecto
    }));
    onImport(resources);
  };

  // Filtrado local por searchTerm ya que la query no lo soporta directamente con tipo
  const filteredResources = resourcesData?.filter(res => 
    res.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#0f172a]/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl flex flex-col overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-100">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900">Importar {typeFilter}</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Catálogo Maestro de Insumos</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Buscador */}
        <div className="p-6 border-b border-gray-50">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text"
              placeholder={`Buscar ${typeFilter.toLowerCase()}...`}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-700 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Lista */}
        <div className="flex-1 overflow-y-auto p-2 min-h-[300px] max-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Consultando Catálogo...</p>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-20">
              <Package className="h-12 w-12 text-gray-100 mx-auto mb-2" />
              <p className="text-sm text-gray-400 italic">No se encontraron resultados.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-1">
              {filteredResources.map((res: ResourceDto, idx: number) => (
                <button
                  key={`${res.id}-${idx}`}
                  onClick={() => toggleSelect(res.id)}
                  className={`flex items-center justify-between p-4 rounded-2xl transition-all ${selectedIds.has(res.id) ? 'bg-blue-50 border-blue-100' : 'hover:bg-gray-50 border-transparent'} border`}
                >
                  <div className="flex items-center gap-4">
                    {selectedIds.has(res.id) ? (
                      <CheckSquare className="h-5 w-5 text-blue-600" />
                    ) : (
                      <Square className="h-5 w-5 text-gray-300" />
                    )}
                    <div className="text-left">
                      <p className={`text-sm font-bold ${selectedIds.has(res.id) ? 'text-blue-900' : 'text-gray-700'}`}>{res.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">{res.unitName} • Bs. {(res.basePrice || 0).toFixed(2)}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50/50 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs font-bold text-gray-500">
            {selectedIds.size} seleccionados
          </p>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={selectedIds.size === 0 || isPending}
              className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white text-sm font-black rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Importar al APU
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportResourcesModal;
