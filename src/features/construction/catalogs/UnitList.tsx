import React, { useState } from 'react';
import { 
  Ruler, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Loader2,
  MoreVertical,
  AlertCircle,
  Globe
} from 'lucide-react';
import Swal from 'sweetalert2';
import { useUnitsQuery, useDeleteUnitMutation } from '../../../hooks/queries/construction/useUnits';
import UnitForm from './UnitForm';
import type { UnitDto } from '../../../types/construction/unit';

const UnitList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<UnitDto | undefined>(undefined);

  const { data: units, isLoading } = useUnitsQuery();
  const { mutate: deleteUnit } = useDeleteUnitMutation();

  const filteredUnits = units?.filter(unit => 
    unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.abbreviation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (unit: UnitDto) => {
    setSelectedUnit(unit);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedUnit(undefined);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    Swal.fire({
      title: '¿Eliminar unidad?',
      text: `Esta acción eliminará "${name}" permanentemente del catálogo.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      customClass: { popup: 'rounded-[32px]' }
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUnit(id);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-medium">Cargando catálogo de unidades...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-left">
        <div className="flex items-center gap-4 text-left">
          <div className="bg-blue-50 p-3 rounded-xl">
            <Ruler className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Unidades de Medida</h2>
            <p className="text-sm text-gray-500 text-left">Gestiona las métricas estándar para tus proyectos.</p>
          </div>
        </div>
        <button 
          onClick={handleCreate}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
        >
          <Plus className="h-4 w-4" />
          Nueva Unidad
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
        <input 
          type="text" 
          placeholder="Buscar unidad o símbolo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-sm bg-white"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden text-left">
        <div className="overflow-x-auto text-left">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Unidad</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Símbolo</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Alcance</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUnits?.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="h-8 w-8 opacity-20" />
                      <p>No se encontraron unidades de medida.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUnits?.map((unit) => (
                  <tr key={unit.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">{unit.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                        {unit.abbreviation}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {unit.isGlobal ? (
                        <span className="flex items-center gap-1.5 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100 w-fit">
                          <Globe className="h-3 w-3" /> Global
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100 w-fit">
                          Privado
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!unit.isGlobal && (
                          <>
                            <button 
                              onClick={() => handleEdit(unit)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="Editar"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(unit.id, unit.name)}
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
      </div>

      {/* Form Slide-over/Modal */}
      {isFormOpen && (
        <UnitForm 
          unit={selectedUnit} 
          onClose={() => setIsFormOpen(false)} 
        />
      )}
    </div>
  );
};

export default UnitList;
