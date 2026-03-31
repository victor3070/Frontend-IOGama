import React, { useState } from 'react';
import { 
  Calculator, 
  Trash2, 
  Search, 
  X, 
  Loader2,
  Package,
  HardHat,
  Truck,
  Settings2,
  Info,
  Printer,
  Plus,
  PackagePlus,
  Edit3
} from 'lucide-react';
import { 
  useUpdateItemResourceMutation,
  useDeleteItemResourceMutation,
  useAddCustomResourceMutation,
  useImportResourcesMutation
} from '../../../hooks/queries/construction/useItems';
import { useSearchResourcesQuery } from '../../../hooks/queries/construction/useResources';
import { useUnitsQuery } from '../../../hooks/queries/construction/useUnits';
import { useB2AnalysisQuery, useDownloadB2Mutation } from '../../../hooks/queries/construction/useReports';
import Swal from 'sweetalert2';
import { sileo } from 'sileo';
import ImportResourcesModal from '../catalogs/ImportResourcesModal';

interface BudgetItemAnalysisProps {
  itemId: string;
  itemName: string;
  moduleId: string;
  projectId: string;
  onClose: () => void;
}

const BudgetItemAnalysis: React.FC<BudgetItemAnalysisProps> = ({ 
  itemId, 
  itemName, 
  moduleId, 
  projectId,
  onClose 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [importModalType, setImportModalType] = useState<string | null>(null);
  
  // Queries
  const { data: analysis, isLoading: isAnalysisLoading } = useB2AnalysisQuery(itemId);
  const { data: resourcesData } = useSearchResourcesQuery(searchTerm, 1, 10);
  const { data: units } = useUnitsQuery();

  // Mutations
  const { mutate: addResource } = useAddCustomResourceMutation(itemId, moduleId, projectId);
  const { mutate: importResources, isPending: isImporting } = useImportResourcesMutation(itemId, moduleId, projectId);
  const { mutate: updateResource } = useUpdateItemResourceMutation(itemId, moduleId, projectId);
  const { mutate: deleteResource } = useDeleteItemResourceMutation(itemId, moduleId, projectId);
  const { mutate: downloadB2, isPending: isDownloadingB2 } = useDownloadB2Mutation();

  const handleAddResource = (resource: any) => {
    // Usamos la importación masiva (aunque sea de uno) para recursos del catálogo
    importResources({
      budgetItemId: itemId,
      resources: [
        {
          resourceId: resource.id,
          performance: 1 // Rendimiento por defecto
        }
      ]
    });
    setSearchTerm('');
  };

  const handleImportResources = (resources: { resourceId: string, performance: number }[]) => {
    importResources({
      budgetItemId: itemId,
      resources
    }, {
      onSuccess: () => {
        setImportModalType(null);
      }
    });
  };

  const handleCreateCustomResource = async (type: string) => {
    const { value: formValues } = await Swal.fire({
      title: `Nuevo ${type}`,
      html: `
        <div class="space-y-4 pt-4 text-left">
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Descripción</label>
            <input id="res-name" class="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-100" placeholder="Nombre del insumo">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Unidad</label>
              <select id="res-unit" class="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-100 bg-white">
                ${units?.map(u => `<option value="${u.id}">${u.abbreviation} - ${u.name}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase mb-1">P. Unitario (Bs.)</label>
              <input id="res-price" type="number" step="0.01" class="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-100" value="0">
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Rendimiento</label>
            <input id="res-perf" type="number" step="0.0001" class="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-100" value="1">
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Añadir al APU',
      confirmButtonColor: '#2563eb',
      customClass: { popup: 'rounded-[32px]' },
      preConfirm: () => {
        const name = (document.getElementById('res-name') as HTMLInputElement).value;
        const unitOfMeasureId = (document.getElementById('res-unit') as HTMLSelectElement).value;
        const unitPrice = parseFloat((document.getElementById('res-price') as HTMLInputElement).value) || 0;
        const performance = parseFloat((document.getElementById('res-perf') as HTMLInputElement).value) || 0;
        if (!name) {
          Swal.showValidationMessage('El nombre es obligatorio');
          return false;
        }
        return { name, unitOfMeasureId, unitPrice, performance, quantity: 0, type, budgetItemId: itemId };
      }
    });

    if (formValues) {
      addResource(formValues);
    }
  };

  const handleEditResource = async (resource: any, type: string) => {
    // Intentamos detectar el ID priorizando los nombres del DTO de presupuesto/análisis
    const resId = resource.budgetItemResourceId || resource.resourceId || resource.id || resource.itemResourceId || 
                  resource.BudgetItemResourceId || resource.ResourceId || resource.Id || resource.ItemResourceId;
    
    if (!resId) {
      Swal.fire({
        title: 'Error de Identificación',
        text: 'No se pudo encontrar el ID único de este recurso para proceder con la edición.',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        customClass: { popup: 'rounded-[32px]' }
      });
      return;
    }

    // Intentamos recuperar el ID de la unidad si no viene en el recurso
    const resolvedUnitId = resource.unitOfMeasureId || units?.find(u => u.name === resource.unit || u.abbreviation === resource.unit)?.id || "";

    const { value: formValues } = await Swal.fire({
      title: 'Editar Recurso',
      html: `
        <div class="space-y-4 pt-4 text-left">
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Descripción</label>
            <input id="edit-res-name" class="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-100" value="${resource.name || ''}" placeholder="Descripción del insumo">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase mb-1">P. Unitario (Bs.)</label>
              <input id="edit-res-price" type="number" step="0.01" class="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-100" value="${resource.unitPrice || 0}">
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Rendimiento</label>
              <input id="edit-res-perf" type="number" step="0.0001" class="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-100" value="${resource.performance || 0}">
            </div>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar Cambios',
      confirmButtonColor: '#2563eb',
      cancelButtonText: 'Cancelar',
      customClass: { popup: 'rounded-[32px]' },
      preConfirm: () => {
        const name = (document.getElementById('edit-res-name') as HTMLInputElement).value.trim();
        const unitPrice = parseFloat((document.getElementById('edit-res-price') as HTMLInputElement).value);
        const performance = parseFloat((document.getElementById('edit-res-perf') as HTMLInputElement).value);
        
        if (!name) {
          Swal.showValidationMessage('La descripción es obligatoria');
          return false;
        }
        if (isNaN(unitPrice) || unitPrice < 0) {
          Swal.showValidationMessage('El precio unitario debe ser un número válido');
          return false;
        }
        if (isNaN(performance) || performance < 0) {
          Swal.showValidationMessage('El rendimiento debe ser un número válido');
          return false;
        }
        return { name, unitPrice, performance };
      }
    });

    if (formValues) {
      updateResource({
        resourceId: resId,
        data: {
          id: resId,
          budgetItemId: itemId,
          name: formValues.name,
          unitOfMeasureId: resolvedUnitId,
          unitPrice: formValues.unitPrice,
          performance: formValues.performance,
          quantity: 0,
          type: type
        }
      });
    }
  };

  const handleUpdate = (resource: any, field: 'performance' | 'unitPrice', value: number, type: string) => {
    const resId = resource.id || resource.budgetItemResourceId || resource.resourceId || resource.itemResourceId || 
                  resource.Id || resource.BudgetItemResourceId || resource.ResourceId || resource.ItemResourceId;
    if (!resId) return;

    if (value < 0) {
      Swal.fire({
        title: 'Valor inválido',
        text: 'No se permiten valores negativos en el análisis.',
        icon: 'warning',
        confirmButtonColor: '#3b82f6',
        customClass: { popup: 'rounded-[32px]' }
      });
      return;
    }
    
    const resolvedUnitId = resource.unitOfMeasureId || units?.find(u => u.name === resource.unit || u.abbreviation === resource.unit)?.id || "";

    updateResource({
      resourceId: resId,
      data: {
        id: resId,
        budgetItemId: itemId,
        name: resource.name,
        unitOfMeasureId: resolvedUnitId,
        unitPrice: field === 'unitPrice' ? value : resource.unitPrice,
        performance: field === 'performance' ? value : resource.performance,
        quantity: 0,
        type: type
      }
    });
  };

  const handleDelete = (resource: any) => {
    const resId = resource.id || resource.budgetItemResourceId || resource.resourceId || resource.itemResourceId || 
                  resource.Id || resource.BudgetItemResourceId || resource.ResourceId || resource.ItemResourceId;
    if (!resId) {
      Swal.fire({
        title: 'Error de Identificación',
        text: 'No se pudo encontrar el ID del recurso para proceder con la eliminación.',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        customClass: { popup: 'rounded-[32px]' }
      });
      return;
    }

    Swal.fire({
      title: '¿Quitar recurso?',
      text: `Se eliminará "${resource.name}" del análisis de precios unitarios.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#9ca3af',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      customClass: { popup: 'rounded-[32px]' }
    }).then((result) => {
      if (result.isConfirmed) {
        deleteResource(resId);
      }
    });
  };

  if (isAnalysisLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/40 backdrop-blur-sm">
        <div className="bg-white p-8 rounded-3xl flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Cargando Análisis (APU)...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f172a]/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-6xl h-[90vh] rounded-[40px] shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-100 text-white">
              <Calculator className="h-6 w-6" />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-black text-gray-900 leading-tight">
                {analysis?.itemName || itemName}
              </h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                APU • {analysis?.itemUnit || 'Unidad'} • {analysis?.projectCode || 'Código'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => downloadB2({ id: itemId, name: itemName })}
              disabled={isDownloadingB2}
              className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 text-slate-700 text-sm font-black rounded-xl hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
            >
              {isDownloadingB2 ? <Loader2 className="h-4 w-4 animate-spin" /> : <Printer className="h-4 w-4 text-blue-600" />}
              {isDownloadingB2 ? 'Generando...' : 'Exportar B-2 (PDF)'}
            </button>
            <button onClick={onClose} className="p-2.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Columna Izquierda: Tablas APU */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Buscador de Insumos */}
            <div className="relative text-left">
              <div className="flex items-center gap-2 mb-3 ml-1">
                <Package className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Añadir Insumos</span>
              </div>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input 
                  type="text"
                  placeholder="Buscar en catálogo..."
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-700 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Resultados de búsqueda */}
              {searchTerm && resourcesData && resourcesData.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  {resourcesData.map((res: any, sIdx: number) => (
                    <button
                      key={`search-${res.id || 'no-id'}-${sIdx}`}
                      onClick={() => handleAddResource(res)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-all border-b border-gray-50 last:border-0"
                    >
                      <div className="text-left">
                        <p className="text-sm font-bold text-gray-800">{res.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{res.type} • {res.unitName}</p>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <p className="text-xs font-black text-blue-600">Bs. {(res.basePrice || 0).toFixed(2)}</p>
                        <Plus className="h-4 w-4 text-blue-600" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Listado de Recursos */}
            <div className="space-y-6">
              {[
                { title: 'Materiales', icon: Package, data: analysis?.materials, color: 'text-amber-600', type: 'Materiales' },
                { title: 'Mano de Obra', icon: HardHat, data: analysis?.labor, color: 'text-blue-600', type: 'Obreros' },
                { title: 'Equipo y Maquinaria', icon: Truck, data: analysis?.equipment, color: 'text-purple-600', type: 'Equipos' }
              ].map((section, idx) => (
                <div key={idx} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                  <div className="px-6 py-4 bg-slate-50/50 border-b border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <section.icon className={`h-4 w-4 ${section.color}`} />
                      <h4 className="text-xs font-black text-gray-700 uppercase tracking-widest">{section.title}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setImportModalType(section.type)}
                        className="flex items-center gap-1.5 px-3 py-1 bg-white border border-blue-100 text-[10px] font-black text-blue-600 uppercase tracking-tighter rounded-lg hover:bg-blue-50 transition-all"
                      >
                        <PackagePlus className="h-3 w-3" /> Importar del Catálogo
                      </button>
                      <button 
                        onClick={() => handleCreateCustomResource(section.type)}
                        className="flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 text-[10px] font-black text-gray-400 uppercase tracking-tighter rounded-lg hover:text-blue-600 hover:border-blue-100 transition-all"
                      >
                        <Plus className="h-3 w-3" /> Crear Nuevo
                      </button>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {!section.data || section.data.length === 0 ? (
                      <div className="p-6 text-center text-gray-400 italic text-xs">Sin registros asignados.</div>
                    ) : (
                      section.data.map((res: any, rIdx: number) => {
                        const resId = res.resourceId || res.id || res.itemResourceId || res.budgetItemResourceId || 
                                      res.ResourceId || res.Id || res.ItemResourceId || res.BudgetItemResourceId;
                        // Clave única garantizada: prefijo + tipo sección + índice + (ID o nombre)
                        const itemKey = `apu-${section.type}-${rIdx}-${resId || res.name}`;
                        return (
                          <div key={itemKey} className="px-6 py-4 flex items-center justify-between group hover:bg-slate-50/50 transition-all">
                            <div className="flex-1 text-left">
                              <p className="text-sm font-bold text-gray-800">{res.name}</p>
                              <p className="text-[10px] text-gray-400 font-medium">{res.unit}</p>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="text-left">
                                <label className="block text-[8px] font-black text-gray-400 uppercase mb-1">Rendimiento</label>
                                <input 
                                  type="number" 
                                  defaultValue={res.performance}
                                  onBlur={(e) => handleUpdate(res, 'performance', parseFloat(e.target.value) || 0, section.type)}
                                  className="w-20 px-2 py-1.5 rounded-lg border border-gray-200 text-xs font-black text-center focus:ring-2 focus:ring-blue-100 outline-none"
                                />
                              </div>
                              <div className="text-left">
                                <label className="block text-[8px] font-black text-gray-400 uppercase mb-1">P. Unitario</label>
                                <input 
                                  type="number" 
                                  defaultValue={res.unitPrice}
                                  onBlur={(e) => handleUpdate(res, 'unitPrice', parseFloat(e.target.value) || 0, section.type)}
                                  className="w-24 px-2 py-1.5 rounded-lg border border-gray-200 text-xs font-black text-center focus:ring-2 focus:ring-blue-100 outline-none"
                                />
                              </div>
                              <div className="w-24 text-right">
                                <label className="block text-[8px] font-black text-gray-400 uppercase mb-1">Subtotal</label>
                                <p className="text-sm font-black text-gray-900">Bs. {res.total.toFixed(2)}</p>
                              </div>
                              <div className="flex items-center gap-1 ml-2">
                                <button 
                                  onClick={() => handleEditResource(res, section.type)}
                                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                  title="Editar nombre/precio"
                                >
                                  <Edit3 className="h-4 w-4" />
                                </button>
                                <button 
                                  onClick={() => handleDelete(res)}
                                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                  title="Eliminar del APU"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Columna Derecha: Resumen de Cálculos Dinámicos */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#0f172a] rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden">
              <h4 className="text-xs font-black text-blue-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Settings2 className="h-4 w-4" /> Desglose de Ley (B-2)
              </h4>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400 font-medium">Total Materiales</span>
                  <span className="font-bold">Bs. {(analysis?.totalMaterials || 0).toFixed(2)}</span>
                </div>
                
                <div className="h-px bg-white/10 my-4"></div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400 font-medium">Mano de Obra (Subtotal)</span>
                  <span className="font-bold">Bs. {(analysis?.laborSubtotal || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 italic">Beneficios Sociales ({(analysis?.socialBenefitsPercentage || 0).toFixed(2)}%)</span>
                  <span className="text-blue-400 font-bold text-xs">Bs. {(analysis?.socialBenefits || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 italic">IVA s/ Mano de Obra ({(analysis?.laborIVAPercentage || 0).toFixed(2)}%)</span>
                  <span className={`${analysis?.laborIVA === 0 ? 'text-slate-600 opacity-50' : 'text-blue-400'} font-bold text-xs`}>
                    Bs. {(analysis?.laborIVA || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-sm text-slate-300 font-bold">Total Mano de Obra</span>
                  <span className="font-bold text-blue-400">Bs. {(analysis?.totalLabor || 0).toFixed(2)}</span>
                </div>
                
                <div className="h-px bg-white/10 my-4"></div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400 font-medium">Equipo y Maquinaria</span>
                  <span className="font-bold">Bs. {(analysis?.equipmentSubtotal || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 italic">Herramientas Menores ({(analysis?.minorToolsPercentage || 0).toFixed(2)}%)</span>
                  <span className={`${analysis?.minorTools === 0 ? 'text-slate-600 opacity-50' : 'text-purple-400'} font-bold text-xs`}>
                    Bs. {(analysis?.minorTools || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-sm text-slate-300 font-bold">Total Equipo</span>
                  <span className="font-bold text-purple-400">Bs. {(analysis?.totalEquipment || 0).toFixed(2)}</span>
                </div>

                <div className="h-px bg-white/10 my-4"></div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400 font-medium text-left">Gastos Generales ({(analysis?.generalExpensesPercentage || 0).toFixed(2)}%)</span>
                  <span className={`${analysis?.generalExpenses === 0 ? 'text-slate-600 opacity-50' : 'text-white'} font-bold text-xs`}>
                    Bs. {(analysis?.generalExpenses || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400 font-medium text-left">Utilidad ({(analysis?.utilityPercentage || 0).toFixed(2)}%)</span>
                  <span className={`${analysis?.utility === 0 ? 'text-slate-600 opacity-50' : 'text-green-400'} font-bold text-xs`}>
                    Bs. {(analysis?.utility || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400 font-medium text-left">Impuestos IT ({(analysis?.itPercentage || 0).toFixed(2)}%)</span>
                  <span className={`${analysis?.taxIT === 0 ? 'text-slate-600 opacity-50' : 'text-white'} font-bold text-xs`}>
                    Bs. {(analysis?.taxIT || 0).toFixed(2)}
                  </span>
                </div>

                <div className="mt-8 pt-6 border-t border-white/20 text-left">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Precio Unitario Final</p>
                  <p className="text-4xl font-black text-white mt-1">Bs. {(analysis?.finalUnitPrice || 0).toFixed(2)}</p>
                  {analysis?.finalUnitPriceLiteral && (
                    <p className="text-[9px] text-slate-500 mt-2 italic leading-tight uppercase">
                      {analysis.finalUnitPriceLiteral}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl flex items-start gap-4">
              <Info className="h-5 w-5 text-blue-600 shrink-0" />
              <div className="text-left">
                <p className="text-xs font-bold text-blue-900">Proyecto: {analysis?.projectName}</p>
                <p className="text-[11px] text-blue-700/70 mt-1 leading-relaxed">
                  Cliente: {analysis?.client}<br/>
                  Ubicación: {analysis?.location}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {importModalType && (
        <ImportResourcesModal 
          typeFilter={importModalType}
          onClose={() => setImportModalType(null)}
          onImport={handleImportResources}
          isPending={isImporting}
        />
      )}
    </div>
  );
};

export default BudgetItemAnalysis;
