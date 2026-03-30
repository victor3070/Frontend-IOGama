import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  Plus, 
  Trash2, 
  Save, 
  Loader2, 
  Package, 
  Calculator,
  AlertCircle
} from 'lucide-react';
import { 
  useTemplateByIdQuery, 
  useAddTemplateResourcesMutation,
  useRemoveTemplateResourcesMutation
} from '../../../hooks/queries/construction/useItemTemplates';
import { useResourcesQuery } from '../../../hooks/queries/construction/useResources';
import Swal from 'sweetalert2';

interface LocalRecipeItem {
  resourceId: string;
  name: string;
  unit: string;
  type: string;
  basePrice: number;
  quantity: number;
}

const TemplateRecipeEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [recipe, setRecipe] = useState<LocalRecipeItem[]>([]);
  
  // Guardamos la lista inicial de IDs para saber qué borrar después
  const [initialResourceIds, setInitialResourceIds] = useState<string[]>([]);

  // Queries
  const { data: template, isLoading: isTemplateLoading } = useTemplateByIdQuery(id!);
  const { data: allResources, isLoading: isCatalogLoading } = useResourcesQuery(1, 500);
  
  // Mutations
  const { mutateAsync: saveResources, isPending: isSaving } = useAddTemplateResourcesMutation(id!);
  const { mutateAsync: removeResources, isPending: isRemoving } = useRemoveTemplateResourcesMutation(id!);

  // Sincronizar la receta existente al cargar
  useEffect(() => {
    if (template?.resources) {
      setRecipe(template.resources);
      setInitialResourceIds(template.resources.map((r: any) => r.resourceId));
    }
  }, [template]);

  const filteredCatalog = allResources?.filter(r => 
    (r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     (r.code && r.code.toLowerCase().includes(searchTerm.toLowerCase()))) &&
    !recipe.some(item => item.resourceId === r.id)
  );

  const handleAddToRecipe = (res: any) => {
    setRecipe(prev => [...prev, {
      resourceId: res.id,
      name: res.name,
      unit: res.unitAbbreviation || '-',
      type: res.type,
      basePrice: res.basePrice || 0,
      quantity: 1
    }]);
  };

  const handleUpdateQuantity = (id: string, qty: number) => {
    setRecipe(prev => prev.map(item => 
      item.resourceId === id ? { ...item, quantity: Math.max(0, qty) } : item
    ));
  };

  const handleRemoveFromRecipe = (id: string) => {
    setRecipe(prev => prev.filter(item => item.resourceId !== id));
  };

  const handleSave = async () => {
    // 1. Identificar qué IDs estaban antes pero ya no están (Borrados)
    const currentIds = recipe.map(item => item.resourceId);
    const idsToRemove = initialResourceIds.filter(id => !currentIds.includes(id));

    try {
      // 2. Si hay borrados, llamar al endpoint DELETE
      if (idsToRemove.length > 0) {
        await removeResources(idsToRemove);
      }

      // 3. Llamar al endpoint POST para actualizar/añadir los que quedan
      if (recipe.length > 0) {
        const payload = recipe.map(item => ({
          resourceId: item.resourceId,
          quantity: Number(item.quantity)
        }));
        await saveResources(payload);
      }

      Swal.fire({
        title: '¡Receta Actualizada!',
        text: 'Los cambios se han guardado permanentemente.',
        icon: 'success',
        confirmButtonColor: '#2563eb',
        customClass: { popup: 'rounded-[32px]' }
      });

      // Actualizar los IDs iniciales para la próxima edición sin recargar
      setInitialResourceIds(currentIds);

    } catch (err) {
      console.error('Error al sincronizar receta:', err);
    }
  };

  const calculateSubtotal = (type: string) => 
    recipe.filter(i => i.type === type || (type === 'Obrero' && i.type === 'Obreros'))
          .reduce((acc, curr) => acc + (curr.basePrice * curr.quantity), 0);

  const totalDirectCost = recipe.reduce((acc, curr) => acc + (curr.basePrice * curr.quantity), 0);

  if (isTemplateLoading || isCatalogLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-medium italic">Sincronizando composición...</p>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-gray-100 shadow-sm text-center max-w-lg mx-auto mt-10">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Actividad no encontrada</h2>
        <button onClick={() => navigate('/construction/templates')} className="mt-4 text-blue-600 font-bold hover:underline text-left">Volver al Catálogo</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-left">
        <div className="flex items-center gap-4 text-left">
          <button onClick={() => navigate('/construction/templates')} className="p-2.5 rounded-xl hover:bg-gray-50 border border-gray-100 transition-all text-gray-400 hover:text-blue-600">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="text-left">
            <div className="flex items-center gap-2 mb-1 text-left">
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase tracking-wider">{template.code}</span>
              <h2 className="text-xl font-bold text-gray-900 leading-none">{template.name}</h2>
            </div>
            <p className="text-sm text-gray-500">Unidad de medida: <span className="font-bold text-gray-700">{template.unitName || template.unit}</span></p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-left">
          <div className="hidden md:flex flex-col items-end mr-4 text-left">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Costo Unitario Maestro</span>
            <span className="text-lg font-black text-gray-900">Bs. {totalDirectCost.toFixed(2)}</span>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving || isRemoving}
            className="flex items-center justify-center gap-2 px-8 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
          >
            {isSaving || isRemoving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Guardar Cambios
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
        {/* Panel de Insumos */}
        <div className="lg:col-span-4 flex flex-col gap-4 text-left">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-[calc(100vh-280px)] text-left">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-left">
              <Package className="h-4 w-4 text-blue-500" /> Añadir Insumos
            </h3>
            <div className="relative mb-4 text-left">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Buscar materiales, obreros..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-sm outline-none bg-gray-50/50"
              />
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar text-left">
              {filteredCatalog?.map(res => (
                <button 
                  key={res.id} 
                  onClick={() => handleAddToRecipe(res)}
                  className="w-full p-3 rounded-xl border border-gray-50 bg-gray-50/30 hover:bg-blue-50 hover:border-blue-100 transition-all group flex items-center justify-between text-left"
                >
                  <div className="flex-1 min-w-0 pr-2 text-left">
                    <p className="text-sm font-bold text-gray-800 truncate">{res.name}</p>
                    <div className="flex items-center gap-2 mt-0.5 text-left">
                      <span className="text-[10px] text-gray-400 font-bold uppercase">{res.unitAbbreviation}</span>
                      <span className="text-[10px] text-blue-600 font-bold">Bs. {res.basePrice}</span>
                    </div>
                  </div>
                  <Plus className="h-4 w-4 text-gray-300 group-hover:text-blue-600 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Matriz de APU */}
        <div className="lg:col-span-8 space-y-6 text-left">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px] text-left">
            <div className="overflow-x-auto text-left">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Insumo</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center w-32">Rendimiento</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Subtotal</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-left">
                  {recipe.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center text-gray-400 text-left">
                        <div className="flex flex-col items-center gap-3 text-left">
                          <Plus className="h-10 w-10 opacity-10" />
                          <p className="text-sm">La receta está vacía.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    recipe.map((item) => (
                      <tr key={item.resourceId} className="hover:bg-gray-50/30 transition-colors group text-left">
                        <td className="px-6 py-4 text-left">
                          <div className="flex flex-col text-left">
                            <span className="text-sm font-bold text-gray-900">{item.name}</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase italic">Unidad: {item.unit}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[10px] font-bold text-gray-500 uppercase bg-gray-100 px-2 py-0.5 rounded">
                            {item.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-left">
                          <input 
                            type="number" 
                            step="0.0001"
                            value={item.quantity}
                            onChange={(e) => handleUpdateQuantity(item.resourceId, parseFloat(e.target.value) || 0)}
                            className="w-24 mx-auto block px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-center"
                          />
                        </td>
                        <td className="px-6 py-4 font-black text-gray-900 text-sm">
                          Bs. {(item.basePrice * item.quantity).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleRemoveFromRecipe(item.resourceId)}
                            className="p-2 text-gray-300 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-left">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Materiales</p>
              <p className="text-lg font-bold text-gray-900">Bs. {calculateSubtotal('Materiales').toFixed(2)}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-left">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Obreros</p>
              <p className="text-lg font-bold text-gray-900">Bs. {calculateSubtotal('Obrero').toFixed(2)}</p>
            </div>
            <div className="bg-blue-600 p-5 rounded-2xl shadow-xl shadow-blue-100 text-left">
              <p className="text-[10px] font-bold text-blue-100 uppercase mb-1 text-left">Costo Directo Unitario</p>
              <p className="text-xl font-black text-white text-left">Bs. {totalDirectCost.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateRecipeEditor;
