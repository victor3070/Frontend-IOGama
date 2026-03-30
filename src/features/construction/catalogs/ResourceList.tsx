import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Loader2,
  MoreVertical,
  Filter,
  Globe,
  Tag,
  Hammer,
  Truck,
  ChevronLeft,
  ChevronRight,
  Database
} from 'lucide-react';
import Swal from 'sweetalert2';
import { 
  useResourcesQuery, 
  useSearchResourcesQuery, 
  useDeleteResourceMutation 
} from '../../../hooks/queries/construction/useResources';
import ResourceForm from './ResourceForm';
import type { ResourceDto } from '../../../types/construction/resource';

const ResourceList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('Todos');
  const [onlyMyTenant, setOnlyMyTenant] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<ResourceDto | undefined>(undefined);
  
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20); 

  // Decidimos qué Query usar: Si hay búsqueda o si es el listado normal
  const isSearching = searchTerm.length > 2;
  
  const { data: listData, isLoading: isListLoading, isPlaceholderData: isListPlaceholder } = 
    useResourcesQuery(page, pageSize, typeFilter, onlyMyTenant);

  const { data: searchData, isLoading: isSearchLoading, isPlaceholderData: isSearchPlaceholder } = 
    useSearchResourcesQuery(searchTerm, page, pageSize);

  const resources = isSearching ? searchData : listData;
  const isLoading = isSearching ? isSearchLoading : isListLoading;
  const isPlaceholderData = isSearching ? isSearchPlaceholder : isListPlaceholder;

  const handleEdit = (resource: ResourceDto) => {
    setSelectedResource(resource);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    Swal.fire({
      title: '¿Eliminar recurso?',
      text: `Esta acción eliminará "${name}" del catálogo.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Sí, eliminar',
      customClass: { popup: 'rounded-[32px]' }
    }).then((result) => {
      if (result.isConfirmed) {
        deleteResource(id);
      }
    });
  };

  const { mutate: deleteResource } = useDeleteResourceMutation();

  const getTypeIcon = (type: string | number) => {
    if (!type) return <Package className="h-3.5 w-3.5" />;
    const t = type.toString().toLowerCase();
    if (t === '1' || t.includes('material')) return <Tag className="h-3.5 w-3.5" />;
    if (t === '2' || t.includes('obrero') || t.includes('mano')) return <Hammer className="h-3.5 w-3.5" />;
    if (t === '3' || t.includes('equipo')) return <Truck className="h-3.5 w-3.5" />;
    return <Package className="h-3.5 w-3.5" />;
  };

  const getTypeLabel = (type: string | number) => {
    if (!type) return 'Desconocido';
    const t = type.toString().toLowerCase();
    if (t === '1' || t.includes('material')) return 'Materiales';
    if (t === '2' || t.includes('obrero') || t.includes('mano')) return 'Mano de Obra';
    if (t === '3' || t.includes('equipo')) return 'Equipos y Herramientas';
    return type.toString();
  };

  if (isLoading && !resources) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 text-left">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-medium">Sincronizando catálogo con el servidor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 text-left">
          <div className="bg-blue-50 p-3 rounded-xl">
            <Package className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-left">
            <h2 className="text-xl font-bold text-gray-900">Catálogo Maestro de Recursos</h2>
            <p className="text-sm text-gray-500">Gestión global de materiales, mano de obra y equipos.</p>
          </div>
        </div>
        <button 
          onClick={() => { setSelectedResource(undefined); setIsFormOpen(true); }}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
        >
          <Plus className="h-4 w-4" />
          Nuevo Insumo
        </button>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Buscador de Servidor */}
          <div className="md:col-span-5 relative">
            <Search className="absolute left-4 top-3 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar por nombre o código en toda la base de datos..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-sm outline-none bg-gray-50/50"
            />
          </div>

          {/* Filtro de Tipo por Servidor */}
          <div className="md:col-span-3 relative">
            <Filter className="absolute left-4 top-3 h-4 w-4 text-gray-400" />
            <select 
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-sm appearance-none cursor-pointer outline-none bg-gray-50/50"
            >
              <option value="Todos">Todas las categorías</option>
              <option value="Materiales">Materiales</option>
              <option value="Obreros">Mano de Obra (Obrero)</option>
              <option value="Equipos">Equipos y Herramientas</option>
            </select>
          </div>

          {/* Toggle Tenant */}
          <div className="md:col-span-4 flex items-center gap-3 pl-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={onlyMyTenant}
                onChange={() => { setOnlyMyTenant(!onlyMyTenant); setPage(1); }}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
            <span className="text-xs font-bold text-gray-600 uppercase tracking-tight">Solo mis insumos</span>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden text-left transition-opacity duration-200 ${isPlaceholderData ? 'opacity-50' : 'opacity-100'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Recurso</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Precio Base</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Origen</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {resources?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-3">
                      <Database className="h-10 w-10 opacity-10" />
                      <p className="text-sm font-medium">No se encontraron insumos con estos filtros.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                resources?.map((res) => (
                  <tr key={res.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">{res.name}</span>
                        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-tighter">CÓD: {res.code || 'S/C'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-[10px] font-bold border border-gray-200 uppercase">
                        {getTypeIcon(res.type)}
                        {res.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-blue-600">Bs. {res.basePrice.toLocaleString()}</span>
                        <span className="text-[10px] text-gray-400 font-medium italic">por {res.unitAbbreviation}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {res.isGlobal ? (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100 uppercase mx-auto">
                          <Globe className="h-3 w-3" /> Global
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100 uppercase">
                          Propio
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!res.isGlobal && (
                          <>
                            <button 
                              onClick={() => handleEdit(res)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="Editar"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(res.id, res.name)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="Eliminar"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINACIÓN DINÁMICA */}
        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Mostrar:</span>
              <select 
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-bold text-gray-600 outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            <p className="text-[10px] text-gray-400 font-medium italic">
              Página actual: {page}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setPage(old => Math.max(old - 1, 1))}
              disabled={page === 1}
              className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-100">
              {page}
            </div>
            <button 
              onClick={() => setPage(old => (resources && resources.length === pageSize ? old + 1 : old))}
              disabled={!resources || resources.length < pageSize}
              className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {isFormOpen && (
        <ResourceForm 
          resource={selectedResource} 
          onClose={() => setIsFormOpen(false)} 
        />
      )}
    </div>
  );
};

export default ResourceList;
