import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Mail, 
  Shield, 
  Calendar, 
  UserPlus, 
  CheckCircle2, 
  XCircle, 
  Lock,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Trash2,
  Settings2,
  Key
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  useEmployees, 
  useUpdateEmployeeStatus, 
  useResetEmployeePassword 
} from '../../hooks/queries/useEmployees';
import { employeeService } from '../../services/employee.service';
import type { EmployeeListItem } from '../../types/employee';
import Swal from 'sweetalert2';
import { sileo } from 'sileo';

const EmployeeList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const { data: employees, isLoading, refetch } = useEmployees();
  const { mutate: updateStatus } = useUpdateEmployeeStatus();
  const { mutate: resetPassword } = useResetEmployeePassword();

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredEmployees = employees?.filter(e => 
    e.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper para renderizar el estado correctamente (Soporta 1/2 y Texto)
  const renderStatusBadge = (estado: any) => {
    const isActive = estado === 'Activo' || estado === 1 || estado === '1';
    const label = isActive ? 'ACTIVO' : 'SUSPENDIDO';
    const colors = isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600';
    
    return (
      <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${colors}`}>
        {label}
      </div>
    );
  };

  const handleEditProfile = async (emp: EmployeeListItem) => {
    setActiveMenuId(null);
    try {
      Swal.fire({ 
        title: 'Cargando datos...', 
        allowOutsideClick: false, 
        didOpen: () => Swal.showLoading(),
        customClass: { popup: 'rounded-[32px]' }
      });
      const detail = await employeeService.getEmployeeDetail(emp.id);
      Swal.close();

      const { value: formValues } = await Swal.fire({
        title: 'Editar Perfil de Empleado',
        html: `
          <div class="space-y-4 pt-4 text-left">
            <div class="grid grid-cols-2 gap-4 text-left">
              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 text-left">Nombres</label>
                <input id="edit-nombres" class="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-100" value="${detail.nombreCompleto.split(' ')[0]}">
              </div>
              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 text-left">Apellido Paterno</label>
                <input id="edit-paterno" class="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-100" value="${detail.nombreCompleto.split(' ')[1] || ''}">
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4 text-left text-left">
              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 text-left">CI</label>
                <input id="edit-ci" class="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-100" value="${detail.ci || ''}">
              </div>
              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 text-left">Celular</label>
                <input id="edit-celular" class="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-100" value="${detail.celular || ''}">
              </div>
            </div>
            <div class="text-left text-left">
              <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 text-left text-left">Dirección</label>
              <input id="edit-direccion" class="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-100" value="${detail.direccion || ''}">
            </div>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Continuar',
        confirmButtonColor: '#2563eb',
        customClass: { popup: 'rounded-[32px]' },
        preConfirm: () => ({
          nombres: (document.getElementById('edit-nombres') as HTMLInputElement).value,
          apellidoPaterno: (document.getElementById('edit-paterno') as HTMLInputElement).value,
          apellidoMaterno: "",
          ci: (document.getElementById('edit-ci') as HTMLInputElement).value,
          celular: (document.getElementById('edit-celular') as HTMLInputElement).value,
          direccion: (document.getElementById('edit-direccion') as HTMLInputElement).value,
        })
      });

      if (formValues) {
        // ALERTA DE CONFIRMACIÓN FINAL
        const confirm = await Swal.fire({
          title: '¿Confirmar actualización?',
          text: "Se guardarán los cambios en el perfil del empleado.",
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Sí, guardar cambios',
          cancelButtonText: 'Revisar',
          confirmButtonColor: '#2563eb',
          customClass: { popup: 'rounded-[32px]' }
        });

        if (confirm.isConfirmed) {
          await employeeService.updateEmployeeProfile(emp.id, formValues);
          sileo.success({ title: 'Perfil actualizado exitosamente' });
          refetch();
        }
      }
    } catch (error) {
      sileo.error({ title: 'Error', description: 'No se pudo cargar o actualizar el perfil.' });
    }
  };

  const handleEditStatus = (id: string, estado: any) => {
    setActiveMenuId(null);
    const isActive = estado === 'Activo' || estado === 1 || estado === '1';
    
    Swal.fire({
      title: isActive ? '¿Suspender Acceso?' : '¿Reactivar Acceso?',
      text: isActive 
        ? 'El empleado no podrá iniciar sesión hasta que sea reactivado.' 
        : 'Se restaurarán los permisos de acceso al sistema para este usuario.',
      icon: isActive ? 'warning' : 'question',
      showCancelButton: true,
      confirmButtonColor: isActive ? '#ef4444' : '#22c55e',
      confirmButtonText: isActive ? 'Sí, suspender' : 'Sí, reactivar',
      cancelButtonText: 'Cancelar',
      customClass: { popup: 'rounded-[32px]' }
    }).then((result) => {
      if (result.isConfirmed) {
        // LÓGICA: 1 es Activo, 2 es Suspendido
        const nextStatus = isActive ? 2 : 1;
        updateStatus({ id, status: nextStatus });
      }
    });
  };

  const handleResetPassword = async (id: string) => {
    setActiveMenuId(null);
    const { value: newPassword } = await Swal.fire({
      title: 'Resetear Contraseña',
      input: 'text',
      inputLabel: 'Nueva Contraseña Temporal',
      inputPlaceholder: 'Ingresa la nueva clave...',
      showCancelButton: true,
      confirmButtonText: 'Actualizar Clave',
      confirmButtonColor: '#2563eb',
      customClass: { popup: 'rounded-[32px]' },
      inputValidator: (value) => {
        if (!value || value.length < 8) return 'La clave debe tener al menos 8 caracteres';
      }
    });

    if (newPassword) {
      resetPassword({ id, newPassword });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 text-left">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Cargando nómina...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 text-left text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 text-left">
        <div className="text-left">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight text-left">Gestión de Empleados</h2>
          <p className="text-gray-500 font-medium text-left">Controla los accesos y niveles de seguridad de tu equipo.</p>
        </div>
        <button 
          onClick={() => navigate('/employees/new')}
          className="flex items-center gap-2 px-8 py-3.5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 text-left"
        >
          <Plus className="h-5 w-5" /> Registrar Empleado
        </button>
      </div>

      <div className="relative w-full md:w-96 text-left">
        <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
        <input 
          type="text"
          placeholder="Buscar por nombre o correo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-100 bg-white outline-none focus:ring-2 focus:ring-blue-100 transition-all text-sm font-medium text-left"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left text-left">
        {filteredEmployees?.map((emp) => (
          <div key={emp.id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group relative text-left">
            <div className="flex items-start justify-between mb-6 text-left">
              <div className="flex items-center gap-4 text-left">
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center font-black text-xl ${emp.esSuperAdmin ? 'bg-purple-100 text-purple-600 border-2 border-purple-200' : 'bg-blue-100 text-blue-600 border-2 border-blue-200'} text-left`}>
                  {emp.nombreCompleto[0]}
                </div>
                <div className="text-left text-left">
                  <h4 className="font-bold text-gray-900 text-lg leading-tight text-left">{emp.nombreCompleto}</h4>
                  <p className="text-xs text-gray-500 font-medium mt-0.5 text-left">{emp.cargo}</p>
                </div>
              </div>
              
              <div className="relative text-left" ref={activeMenuId === emp.id ? menuRef : null}>
                <button 
                  onClick={() => setActiveMenuId(activeMenuId === emp.id ? null : emp.id)}
                  className={`p-2 rounded-xl transition-all ${activeMenuId === emp.id ? 'bg-gray-100 text-gray-900 shadow-inner' : 'text-gray-300 hover:text-gray-900 hover:bg-gray-50'} text-left`}
                >
                  <MoreVertical className="h-5 w-5 text-left" />
                </button>
                
                {activeMenuId === emp.id && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-left">
                    <button onClick={() => handleEditProfile(emp)} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 text-left text-left">
                      <UserPlus className="h-4 w-4 text-left" /> Editar Perfil
                    </button>
                    <button onClick={() => { setActiveMenuId(null); navigate(`/employees/${emp.id}/permissions`); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-blue-600 hover:bg-blue-50 text-left text-left">
                      <Settings2 className="h-4 w-4 text-left" /> Matriz de Seguridad
                    </button>
                    <button onClick={() => handleResetPassword(emp.id)} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-amber-600 hover:bg-amber-50 text-left text-left">
                      <Key className="h-4 w-4 text-left" /> Resetear Clave
                    </button>
                    <hr className="my-1 border-gray-50 text-left" />
                    <button onClick={() => handleEditStatus(emp.id, emp.estado)} className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold ${emp.estado === 'Activo' || emp.estado === 1 ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'} text-left text-left text-left`}>
                      {(emp.estado === 'Activo' || emp.estado === 1) ? <XCircle className="h-4 w-4 text-left" /> : <CheckCircle2 className="h-4 w-4 text-left" />}
                      {(emp.estado === 'Activo' || emp.estado === 1) ? 'Suspender Acceso' : 'Reactivar Acceso'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3 mb-6 text-left text-left">
              <div className="flex items-center gap-2.5 text-gray-500 text-left text-left">
                <Mail className="h-4 w-4 opacity-40 text-left" />
                <span className="text-xs font-medium">{emp.email}</span>
              </div>
              <div className="flex items-center gap-2.5 text-gray-500 text-left text-left">
                <Calendar className="h-4 w-4 opacity-40 text-left" />
                <span className="text-xs font-medium text-left">Registrado: {new Date(emp.fechaRegistro).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-left text-left">
              {renderStatusBadge(emp.estado)}
              {emp.esSuperAdmin && (
                <div className="flex items-center gap-1 text-purple-600 text-left">
                  <ShieldCheck className="h-4 w-4 text-left" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-left">Super Admin</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeList;
