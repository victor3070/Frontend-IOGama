import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  ArrowLeft, 
  Save, 
  Loader2, 
  Construction, 
  CheckSquare, 
  AlertCircle,
  Building2,
  Lock,
  Briefcase,
  ShieldCheck,
  Globe,
  Info
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { employeeService } from '../../services/employee.service';
import { 
  useUpdatePermissions, 
  useUpdateGatekeeperPermissionsMutation,
  useEmployees
} from '../../hooks/queries/useEmployees';
import type { UserPermissions, GatekeeperPermissionsMap } from '../../types/employee';
import Swal from 'sweetalert2';

const CONSTRUCTION_FUNCTIONS = [
  { id: 'PROJECT_CREATE', label: 'Crear Proyectos' },
  { id: 'PROJECT_EDIT', label: 'Editar Proyectos' },
  { id: 'BUDGET_EDIT', label: 'Gestionar Presupuestos' },
  { id: 'COSTS_VIEW', label: 'Ver Costos Reales' },
  { id: 'RESOURCE_APPROVE', label: 'Aprobar Insumos' },
  { id: 'REPORTS_GENERATE', label: 'Generar Reportes' },
];

const EmployeePermissions: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Estado para la capa del Portero (UserManagement)
  const [areaTrabajo, setAreaTrabajo] = useState('');
  const [esSuperAdmin, setEsSuperAdmin] = useState(false);
  const [gatekeeperAccess, setGatekeeperAccess] = useState(true);

  // Estado para la capa Granular (Construction)
  const [localPermissions, setLocalPermissions] = useState<UserPermissions>({
    Construction: { access: false, permissions: [] }
  });

  // Queries
  const { data: employees } = useEmployees();
  const employee = employees?.find(e => e.id === id);

  const { data: remotePermissions, isLoading: isGranularLoading } = useQuery({
    queryKey: ['employees', 'permissions', id],
    queryFn: () => employeeService.getUserPermissions(id!),
    enabled: !!id
  });

  // Mutations
  const { mutateAsync: updateGatekeeper, isPending: isSavingGatekeeper } = useUpdateGatekeeperPermissionsMutation(id!);
  const { mutateAsync: updateGranular, isPending: isSavingGranular } = useUpdatePermissions(id!);

  // Inicializar estados desde los datos del empleado
  useEffect(() => {
    if (employee) {
      setAreaTrabajo(employee.cargo || '');
      setEsSuperAdmin(employee.esSuperAdmin || false);
    }
    if (remotePermissions) {
      setLocalPermissions(remotePermissions);
      setGatekeeperAccess(!!remotePermissions['Construction']?.access);
    }
  }, [employee, remotePermissions]);

  const handleToggleFunction = (module: string, permissionId: string) => {
    setLocalPermissions(prev => {
      const currentPermissions = prev[module]?.permissions || [];
      const newPermissions = currentPermissions.includes(permissionId)
        ? currentPermissions.filter(p => p !== permissionId)
        : [...currentPermissions, permissionId];

      return {
        ...prev, [module]: { ...prev[module], permissions: newPermissions }
      };
    });
  };

  const handleSaveAll = async () => {
    try {
      // 1. Guardar en UserManagement (Portero)
      await updateGatekeeper({
        areaTrabajo,
        esSuperAdmin,
        permisos: {
          "Construccion": {
            acceso: gatekeeperAccess,
            funcionalidades: ["x_x"],
            recursosIds: ["x_x"]
          }
        }
      });

      // 2. Guardar en Construction (Granular)
      await updateGranular({
        ...localPermissions,
        "Construction": {
          ...localPermissions["Construction"],
          access: gatekeeperAccess
        }
      });

      Swal.fire({
        title: '¡Seguridad Actualizada!',
        text: 'Los cambios se han sincronizado en ambos servidores.',
        icon: 'success',
        confirmButtonColor: '#2563eb',
        customClass: { popup: 'rounded-[32px]' }
      });
    } catch (error) {
      console.error('Error al guardar permisos:', error);
    }
  };

  if (isGranularLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
        <p className="text-gray-500">Sincronizando con servidores de seguridad...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-left animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/employees')} className="p-2.5 rounded-xl text-gray-500 hover:bg-gray-50 border border-gray-100 transition-all">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="text-left">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-blue-600" /> Matriz de Seguridad Granular
            </h2>
            <p className="text-sm text-gray-500">Configurando accesos para: <span className="font-bold text-gray-900">{employee?.nombreCompleto}</span></p>
          </div>
        </div>
        <button
          onClick={handleSaveAll}
          disabled={isSavingGatekeeper || isSavingGranular}
          className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
        >
          {isSavingGatekeeper || isSavingGranular ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Sincronizar Permisos
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel Izquierdo: Configuración del Portero (UserManagement) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6 text-left">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-4">
              <Briefcase className="h-4 w-4 text-blue-500" /> Rol Administrativo
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Área / Cargo Actual</label>
                <input 
                  type="text" 
                  value={areaTrabajo}
                  onChange={(e) => setAreaTrabajo(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-100 text-sm font-medium"
                />
              </div>

              <div className={`p-4 rounded-2xl border transition-all ${esSuperAdmin ? 'bg-purple-50 border-purple-100 ring-1 ring-purple-200' : 'bg-gray-50 border-gray-100'}`}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={esSuperAdmin}
                    onChange={(e) => setEsSuperAdmin(e.target.checked)}
                    className="mt-1 h-4 w-4 text-purple-600 rounded" 
                  />
                  <div>
                    <span className={`text-sm font-bold flex items-center gap-1.5 ${esSuperAdmin ? 'text-purple-900' : 'text-gray-700'}`}>
                      <Shield className="h-4 w-4" /> Acceso Super Admin
                    </span>
                    <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed italic">
                      Habilita todas las funciones del sistema automáticamente para este usuario.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-2xl flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 shrink-0" />
            <p className="text-xs text-blue-700 leading-relaxed text-left">
              El <strong>Portero</strong> sincroniza el acceso global al microservicio, mientras que la <strong>Matriz</strong> define qué puede hacer el usuario una vez dentro.
            </p>
          </div>
        </div>

        {/* Panel Derecho: Matriz Granular (Construction) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-left">
            <div className={`p-6 flex items-center justify-between border-b border-gray-50 ${gatekeeperAccess ? 'bg-blue-50/30' : 'bg-gray-50/50'}`}>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${gatekeeperAccess ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'bg-gray-200 text-gray-400'}`}>
                  <Construction className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-900">Módulo de Construcción</h3>
                  <p className="text-xs text-gray-500">Control de obras, presupuestos y recursos.</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={gatekeeperAccess}
                  onChange={(e) => setGatekeeperAccess(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="p-8">
              {!gatekeeperAccess ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400 space-y-3">
                  <Lock className="h-10 w-10 opacity-20" />
                  <p className="text-sm font-medium italic">Acceso revocado a nivel global</p>
                </div>
              ) : esSuperAdmin ? (
                <div className="flex flex-col items-center justify-center py-12 text-purple-400 space-y-3 bg-purple-50/20 rounded-2xl border border-dashed border-purple-100">
                  <ShieldCheck className="h-10 w-10" />
                  <div className="text-center">
                    <p className="text-sm font-bold text-purple-900 uppercase tracking-widest">Control Total Activado</p>
                    <p className="text-xs text-purple-600 mt-1">Como Super Admin, el usuario tiene acceso a todas las funciones.</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <h4 className="md:col-span-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Funcionalidades Granulares</h4>
                  {CONSTRUCTION_FUNCTIONS.map((func) => (
                    <label 
                      key={func.id} 
                      className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                        localPermissions['Construction']?.permissions.includes(func.id)
                        ? 'border-blue-200 bg-blue-50/30 ring-1 ring-blue-100 shadow-sm'
                        : 'border-gray-100 hover:border-blue-100 hover:bg-gray-50'
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        checked={localPermissions['Construction']?.permissions.includes(func.id) || false}
                        onChange={() => handleToggleFunction('Construction', func.id)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" 
                      />
                      <span className={`text-sm font-bold ${localPermissions['Construction']?.permissions.includes(func.id) ? 'text-blue-900' : 'text-gray-600'}`}>
                        {func.label}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeePermissions;
