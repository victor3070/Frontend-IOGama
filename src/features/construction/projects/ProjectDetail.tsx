import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Settings, 
  Layout, 
  Calculator, 
  Save, 
  Loader2, 
  Percent,
  TrendingUp,
  AlertCircle,
  Plus,
  Trash2,
  FolderOpen,
  ChevronDown,
  ExternalLink,
  PackagePlus,
  Edit3,
  Users,
  FileText,
  Download,
  Share2,
  Crown,
  CheckCircle2,
  Shield,
  Clock,
  Printer,
  MoreVertical,
  UserMinus,
  Settings2,
  UserPlus
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { 
  useProjectsQuery, 
  useProjectParametersQuery, 
  useUpdateProjectParametersMutation 
} from '../../../hooks/queries/construction/useProjects';
import { 
  useModulesQuery, 
  useCreateModuleMutation, 
  useDeleteModuleMutation 
} from '../../../hooks/queries/construction/useModules';
import { 
  useModuleItemsQuery, 
  useUpdateItemMutation, 
  useDeleteItemMutation 
} from '../../../hooks/queries/construction/useItems';
import { 
  useProjectMembersQuery,
  useInviteMembersMutation,
  useUpdateMembersMutation,
  useTransferManagerMutation
} from '../../../hooks/queries/construction/useProjectMembers';
import {
  useDownloadB1Mutation,
  useDownloadB2Mutation,
  useDownloadProjectB2Mutation,
  useDownloadB3Mutation,
  useB1DataQuery,
  useB3DataQuery
} from '../../../hooks/queries/construction/useReports';
import { useEmployees } from '../../../hooks/queries/useEmployees';
import { useAuthStore } from '../../../store/authStore';
import type { UpdateProjectParametersRequest } from '../../../types/construction/projectParameters';
import type { BudgetItemDto } from '../../../types/construction/item';
import type { ProjectMemberDto, MemberActionRequest } from '../../../types/construction/projectMember';
import Swal from 'sweetalert2';
import ImportTemplatesModal from '../catalogs/ImportTemplatesModal';
import BudgetItemAnalysis from './BudgetItemAnalysis';

// --- Sub-componente para los ítems de un módulo ---
const ModuleItemsTable: React.FC<{ 
  moduleId: string; 
  projectId: string;
  onViewAnalysis: (itemId: string, itemName: string, moduleId: string) => void;
}> = ({ moduleId, projectId, onViewAnalysis }) => {
  const { data: items, isLoading } = useModuleItemsQuery(moduleId);
  const { mutate: updateItem } = useUpdateItemMutation(moduleId, projectId);
  const { mutate: deleteItem } = useDeleteItemMutation(moduleId, projectId);

  const handleUpdateQuantity = (item: BudgetItemDto, newQty: number) => {
    if (newQty === item.quantity) return;
    updateItem({ id: item.id, data: { quantity: newQty } });
  };

  const handleDelete = (id: string, name: string) => {
    Swal.fire({
      title: '¿Eliminar ítem?',
      text: `Se quitará "${name}" del presupuesto.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Sí, eliminar',
      customClass: { popup: 'rounded-[32px]' }
    }).then((result) => {
      if (result.isConfirmed) {
        deleteItem(id);
      }
    });
  };

  if (isLoading) return <div className="p-4 flex justify-center text-left text-left"><Loader2 className="h-5 w-5 animate-spin text-blue-400" /></div>;

  return (
    <div className="overflow-x-auto bg-gray-50/30 rounded-b-2xl border-t border-gray-100 text-left text-left">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100 text-left text-left">
            <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-left text-left">Código</th>
            <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-left text-left">Descripción del Ítem</th>
            <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase text-center w-28 text-left text-left">Cant.</th>
            <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase text-left text-left">P. Unit (Bs.)</th>
            <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase text-left text-left">Total (Bs.)</th>
            <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase text-right text-left text-left">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white/50 text-left text-left">
          {items?.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-xs text-gray-400 italic text-left text-left">No hay actividades en este capítulo. Importa plantillas desde el catálogo maestro.</td>
            </tr>
          ) : (
            items?.map((item) => (
              <tr key={item.id} className="hover:bg-white transition-colors group text-left text-left text-left text-left">
                <td className="px-6 py-3 text-xs font-bold text-blue-600 text-left text-left">{item.code}</td>
                <td className="px-6 py-3 text-left text-left text-left">
                  <p className="text-xs font-bold text-gray-800 text-left text-left">{item.name}</p>
                  <p className="text-[10px] text-gray-400 italic font-medium text-left text-left text-left">Unidad: {item.unit}</p>
                </td>
                <td className="px-6 py-3 text-left text-left">
                  <input 
                    type="number"
                    defaultValue={item.quantity}
                    onBlur={(e) => handleUpdateQuantity(item, parseFloat(e.target.value) || 0)}
                    className="w-20 mx-auto block px-2 py-1 rounded-lg border border-gray-200 text-xs font-bold text-center focus:ring-2 focus:ring-blue-100 outline-none text-left text-left"
                  />
                </td>
                <td className="px-6 py-3 text-xs text-gray-600 font-medium text-left text-left">{item.unitPrice.toLocaleString()}</td>
                <td className="px-6 py-3 text-xs font-black text-gray-900 text-left text-left">{item.total.toLocaleString()}</td>
                <td className="px-6 py-3 text-right text-left text-left">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity text-left text-left text-left">
                    <button 
                      onClick={() => onViewAnalysis(item.id, item.name, moduleId)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all text-left text-left" 
                      title="Análisis de Precios Unitarios"
                    >
                      <Calculator className="h-3.5 w-3.5 text-left text-left" />
                    </button>
                    <button onClick={() => handleDelete(item.id, item.name)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all text-left text-left text-left" title="Eliminar">
                      <Trash2 className="h-3.5 w-3.5 text-left text-left" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

// --- Sub-componente para Previsualización B-3 ---
const B3ResourcesPreview: React.FC<{ projectId: string; filter: string }> = ({ projectId, filter }) => {
  const { data: b3Data, isLoading } = useB3DataQuery(projectId, filter);

  if (isLoading) return (
    <div className="mt-8 p-12 bg-white rounded-[40px] border border-gray-100 flex flex-col items-center justify-center gap-4">
      <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Cargando vista previa de insumos...</p>
    </div>
  );

  if (!b3Data) return null;

  const sections = [
    { title: 'Materiales', data: b3Data?.materials || [], color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: 'Mano de Obra', data: b3Data?.labor || [], color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Equipo y Maquinaria', data: b3Data?.equipment || [], color: 'text-purple-600', bg: 'bg-purple-50' }
  ];

  const hasData = sections.some(s => s.data && s.data.length > 0);

  return (
    <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex items-center justify-between px-4">
        <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
          Vista Previa: Insumos Consolidados {filter ? `(${filter})` : ''}
        </h4>
      </div>

      {!hasData ? (
        <div className="p-12 bg-white rounded-[40px] border border-gray-100 text-center">
          <p className="text-gray-400 italic text-sm">No se encontraron insumos para este filtro.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {sections.map((section, idx) => section.data.length > 0 && (
            <div key={idx} className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
              <div className={`px-8 py-4 ${section.bg} border-b border-gray-50 flex items-center gap-2`}>
                <h5 className={`text-[10px] font-black uppercase tracking-widest ${section.color}`}>{section.title}</h5>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-50">
                      <th className="px-8 py-3 text-[10px] font-black text-gray-400 uppercase w-16">#</th>
                      <th className="px-8 py-3 text-[10px] font-black text-gray-400 uppercase">Descripción del Insumo</th>
                      <th className="px-8 py-3 text-[10px] font-black text-gray-400 uppercase">Unidad</th>
                      <th className="px-8 py-3 text-[10px] font-black text-gray-400 uppercase text-right">P. Unitario (Bs.)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {section.data.map((item) => (
                      <tr key={item.index} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-3 text-xs font-bold text-gray-400">{item.index}</td>
                        <td className="px-8 py-3 text-xs font-bold text-gray-800">{item.name}</td>
                        <td className="px-8 py-3 text-xs text-gray-500 font-medium">{item.unit}</td>
                        <td className="px-8 py-3 text-xs font-black text-gray-900 text-right">{(item.unitPrice || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Componente Principal ---
const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'budget' | 'settings' | 'team' | 'reports'>('budget');
  const [importModule, setImportModule] = useState<{id: string, name: string} | null>(null);
  const [analysisItem, setAnalysisItem] = useState<{id: string, name: string, moduleId: string} | null>(null);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [activeMemberMenu, setActiveMemberMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Queries
  const { data: projects, isLoading: isProjectsLoading } = useProjectsQuery();
  const currentProject = projects?.find(p => p.id === id);

  const { data: parameters, isLoading: isParamsLoading } = useProjectParametersQuery(id!);
  const { data: modules, isLoading: isModulesLoading } = useModulesQuery(id!);
  const { data: members, isLoading: isMembersLoading } = useProjectMembersQuery(id!);
  const { data: b1Data } = useB1DataQuery(id!);
  const { data: allEmployees } = useEmployees();

  // Mutations
  const { mutate: updateParams, isPending: isUpdating } = useUpdateProjectParametersMutation(id!);
  const { mutate: createModule } = useCreateModuleMutation(id!);
  const { mutate: deleteModule } = useDeleteModuleMutation(id!);
  const { mutate: inviteMembers } = useInviteMembersMutation(id!);
  const { mutate: updateMembers } = useUpdateMembersMutation(id!);
  const { mutate: transferManager } = useTransferManagerMutation(id!);
  // Mutations de Reportes
  const { mutate: downloadB1, isPending: isDownloadingB1 } = useDownloadB1Mutation();
  const { mutate: downloadB2, isPending: isDownloadingB2 } = useDownloadB2Mutation();
  const { mutate: downloadProjectB2, isPending: isDownloadingProjectB2 } = useDownloadProjectB2Mutation();
  const { mutate: downloadB3, isPending: isDownloadingB3 } = useDownloadB3Mutation();

  const [b3Filter, setB3Filter] = useState<string>("");

  const { register, handleSubmit, reset, formState: { isDirty } } = useForm<UpdateProjectParametersRequest>();

  // Permisos del usuario actual sobre esta obra
  const myMemberInfo = members?.find(m => m.userId === currentUser?.id);
  const isHighLevelAdmin = currentUser?.role === 'Empresa' || currentUser?.role === 'SubCuentaEmpresa' || currentUser?.role === 'SuperAdminGlobal';
  
  const canModifyBudget = myMemberInfo?.isEncargado || myMemberInfo?.canEdit || isHighLevelAdmin;
  const canManageTeam = myMemberInfo?.isEncargado || myMemberInfo?.canShare || isHighLevelAdmin;

  useEffect(() => {
    if (parameters) {
      reset(parameters);
    }
  }, [parameters, reset]);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMemberMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const onSubmitParams = (data: UpdateProjectParametersRequest) => {
    Swal.fire({
      title: '¿Guardar Cambios?',
      text: "Se actualizarán los parámetros impositivos para este proyecto.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#9ca3af',
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar',
      customClass: { popup: 'rounded-[32px]' }
    }).then((result) => {
      if (result.isConfirmed) {
        updateParams(data);
      }
    });
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const handleAddModule = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Añadir Nuevo Módulo',
      html: `
        <div class="space-y-4 pt-4 text-left text-left">
          <div class="text-left">
            <label class="block text-xs font-bold text-gray-400 uppercase mb-1 text-left">Nombre del Capítulo</label>
            <input id="swal-name" class="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-100 text-left" placeholder="Ej. Obras Preliminares">
          </div>
          <div class="mt-4 text-left text-left">
            <label class="block text-xs font-bold text-gray-400 uppercase mb-1 text-left text-left">Descripción corta</label>
            <input id="swal-desc" class="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-100 text-left" placeholder="Opcional...">
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Crear Módulo',
      confirmButtonColor: '#2563eb',
      customClass: { popup: 'rounded-[32px]' },
      preConfirm: () => {
        const name = (document.getElementById('swal-name') as HTMLInputElement).value;
        const description = (document.getElementById('swal-desc') as HTMLInputElement).value;
        if (!name) {
          Swal.showValidationMessage('El nombre es obligatorio');
          return false;
        }
        return { name, description };
      }
    });

    if (formValues) {
      createModule({
        projectId: id!,
        name: formValues.name,
        description: formValues.description,
        order: modules?.length || 0
      });
    }
  };

  const handleDeleteModule = (moduleId: string, name: string) => {
    Swal.fire({
      title: '¿Eliminar módulo?',
      text: `Se borrará "${name}" y todos los ítems dentro de él.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Sí, eliminar',
      customClass: { popup: 'rounded-[32px]' }
    }).then((result) => {
      if (result.isConfirmed) {
        deleteModule(moduleId);
      }
    });
  };

  // Handlers para descargas con confirmación
  const handleDownloadB1 = () => {
    if (!currentProject) return;
    Swal.fire({
      title: '¿Generar Presupuesto?',
      text: "Se procesará el Formulario B-1 en formato PDF.",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      confirmButtonText: 'Generar ahora',
      cancelButtonText: 'Cancelar',
      customClass: { popup: 'rounded-[32px]' }
    }).then((result) => {
      if (result.isConfirmed) {
        downloadB1({ id: id!, name: currentProject.name });
      }
    });
  };

  const handleDownloadProjectB2 = () => {
    if (!currentProject) return;
    Swal.fire({
      title: '¿Generar APU Masivo?',
      text: "Se generará un solo PDF con todos los análisis del proyecto. Esto puede tardar unos segundos.",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      confirmButtonText: 'Generar ahora',
      cancelButtonText: 'Cancelar',
      customClass: { popup: 'rounded-[32px]' }
    }).then((result) => {
      if (result.isConfirmed) {
        downloadProjectB2({ id: id!, name: currentProject.name });
      }
    });
  };

  const handleDownloadB3 = () => {
    if (!currentProject) return;
    const filterText = b3Filter ? ` (${b3Filter})` : "";
    Swal.fire({
      title: `¿Generar Insumos${filterText}?`,
      text: "Se procesará el Formulario B-3 consolidado.",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#16a34a',
      confirmButtonText: 'Generar ahora',
      cancelButtonText: 'Cancelar',
      customClass: { popup: 'rounded-[32px]' }
    }).then((result) => {
      if (result.isConfirmed) {
        downloadB3({ id: id!, name: currentProject.name, filter: b3Filter });
      }
    });
  };

  const handleInvite = async () => {
    if (!canManageTeam) return;

    // Filtrar empleados que no están ya en la obra
    const availableEmployees = allEmployees?.filter(e => !members?.some(m => m.userId === e.id)) || [];

    const { value: formValues } = await Swal.fire({
      title: 'Asignar Personal a la Obra',
      width: '600px',
      html: `
        <div class="space-y-6 pt-4 text-left">
          <div class="bg-blue-50 p-4 rounded-2xl border border-blue-100 mb-4 text-left">
            <p class="text-xs text-blue-700 font-medium leading-relaxed">Marca los empleados que deseas incorporar al proyecto. Se les asignará el mismo rol y permisos de forma masiva.</p>
          </div>

          <div class="text-left">
            <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">1. Seleccionar Personal (${availableEmployees.length})</label>
            <div id="employees-list" class="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar text-left">
              ${availableEmployees.map(e => `
                <label class="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition-all group">
                  <input type="checkbox" name="emp-checkbox" value="${e.id}" data-name="${e.nombreCompleto}" class="h-5 w-5 rounded-lg text-blue-600 border-gray-300 focus:ring-blue-500">
                  <div class="text-left">
                    <p class="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors">${e.nombreCompleto}</p>
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">${e.cargo || 'Personal General'}</p>
                  </div>
                </label>
              `).join('')}
              ${availableEmployees.length === 0 ? '<p class="text-center py-8 text-gray-400 italic text-sm text-left">No hay más empleados disponibles para invitar.</p>' : ''}
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 text-left text-left">
            <div class="text-left">
              <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">2. Definir Rol</label>
              <select id="invite-role" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-100 bg-white font-bold text-sm text-left">
                <option value="Admin">Administrador</option>
                <option value="Resident">Residente de Obra</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Viewer" selected>Lector (Solo Vista)</option>
              </select>
            </div>
            <div class="text-left text-left">
              <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 text-left">3. Permisos</label>
              <div class="flex flex-col gap-2 text-left">
                <label class="flex items-center gap-2 text-sm cursor-pointer font-medium text-gray-600 text-left">
                  <input type="checkbox" id="invite-edit" class="h-4 w-4 rounded text-blue-600"> <span>Permitir Edición</span>
                </label>
                <label class="flex items-center gap-2 text-sm cursor-pointer font-medium text-gray-600 text-left text-left">
                  <input type="checkbox" id="invite-share" checked class="h-4 w-4 rounded text-blue-600"> <span>Permitir Compartir</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Incorporar a Obra',
      confirmButtonColor: '#2563eb',
      customClass: { popup: 'rounded-[32px]' },
      preConfirm: () => {
        const checkboxes = document.querySelectorAll('input[name="emp-checkbox"]:checked');
        const role = (document.getElementById('invite-role') as HTMLSelectElement).value;
        const canEdit = (document.getElementById('invite-edit') as HTMLInputElement).checked;
        const canShare = (document.getElementById('invite-share') as HTMLInputElement).checked;

        if (checkboxes.length === 0) {
          Swal.showValidationMessage('Selecciona al menos un empleado');
          return false;
        }

        const membersToInvite: MemberActionRequest[] = Array.from(checkboxes).map((cb: any) => ({
          externalUserId: cb.value,
          fullName: cb.getAttribute('data-name'),
          canView: true,
          canEdit,
          canShare,
          role
        }));

        return membersToInvite;
      }
    });

    if (formValues) {
      inviteMembers({
        projectId: id!,
        members: formValues
      });
    }
  };

  const handleUpdateMember = async (member: ProjectMemberDto) => {
    setActiveMemberMenu(null); // Cerrar el menú antes de abrir el modal
    
    if (!canManageTeam || member.isEncargado) return;

    const { value: formValues } = await Swal.fire({
      title: 'Ajustar Privilegios',
      text: `Colaborador: ${member.fullName}`,
      html: `
        <div class="space-y-4 mt-4 text-left p-6 bg-gray-50 rounded-3xl text-left text-left">
          <div class="text-left text-left text-left">
            <label class="block text-xs font-black text-gray-400 uppercase mb-2 text-left">Rol Asignado</label>
            <select id="edit-role" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none bg-white font-bold text-sm text-left text-left">
              <option value="Admin" ${member.role === 'Admin' ? 'selected' : ''}>Administrador</option>
              <option value="Resident" ${member.role === 'Resident' ? 'selected' : ''}>Residente</option>
              <option value="Supervisor" ${member.role === 'Supervisor' ? 'selected' : ''}>Supervisor</option>
              <option value="Viewer" ${member.role === 'Viewer' ? 'selected' : ''}>Lector</option>
            </select>
          </div>
          <div class="space-y-3 text-left text-left">
            <label class="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-white transition-all text-left text-left">
              <input type="checkbox" id="edit-can-edit" ${member.canEdit ? 'checked' : ''} class="h-5 w-5 rounded text-blue-600 text-left">
              <span class="text-sm font-bold text-gray-700 text-left">Habilitar Edición de Presupuesto</span>
            </label>
            <label class="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-white transition-all text-left text-left">
              <input type="checkbox" id="edit-can-share" ${member.canShare ? 'checked' : ''} class="h-5 w-5 rounded text-blue-600 text-left">
              <span class="text-sm font-bold text-gray-700 text-left">Habilitar Invitación de otros</span>
            </label>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar Cambios',
      confirmButtonColor: '#2563eb',
      customClass: { popup: 'rounded-[32px]' },
      preConfirm: () => ({
        externalUserId: member.userId,
        canView: true,
        canEdit: (document.getElementById('edit-can-edit') as HTMLInputElement).checked,
        canShare: (document.getElementById('edit-can-share') as HTMLInputElement).checked,
        role: (document.getElementById('edit-role') as HTMLSelectElement).value
      })
    });

    if (formValues) {
      updateMembers({ 
        projectId: id!,
        members: [formValues] 
      });
    }
  };

  const handleTransfer = (member: ProjectMemberDto) => {
    setActiveMemberMenu(null);
    if (currentUser?.role !== 'Empresa' && !myMemberInfo?.isEncargado) return;

    Swal.fire({
      title: '¿Transferir Liderazgo?',
      text: `Vas a ceder el control total de la obra a ${member.fullName}. Esta acción es irreversible.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f59e0b',
      confirmButtonText: 'Sí, transferir cargo',
      customClass: { popup: 'rounded-[32px]' }
    }).then((result) => {
      if (result.isConfirmed) {
        transferManager(member.userId);
      }
    });
  };

  if (isProjectsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 text-left text-left text-left">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin text-left text-left" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs text-left">Cargando proyecto...</p>
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center text-left text-left text-left text-left">
        <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4 text-left text-left" />
        <h2 className="text-xl font-bold text-gray-900 text-left text-left">Proyecto no encontrado</h2>
        <button onClick={() => navigate('/construction/projects')} className="mt-4 text-blue-600 font-bold hover:underline text-left">Volver</button>
      </div>
    );
  }

  // Cálculos Gerenciales
  const totalGeneral = modules?.reduce((acc, curr) => acc + curr.totalAmount, 0) || 0;

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-500 text-left text-left text-left text-left">
      {/* Header Centralizado */}
      <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-white/10 text-left text-left text-left">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 text-left text-left">
          <div className="flex items-center gap-4 text-left text-left text-left">
            <button onClick={() => navigate('/construction/projects')} className="p-3 rounded-2xl hover:bg-gray-50 border border-gray-100 transition-all text-gray-400 hover:text-blue-600 text-left text-left text-left">
              <ArrowLeft className="h-5 w-5 text-left text-left" />
            </button>
            <div className="text-left text-left text-left text-left">
              <div className="flex items-center gap-2 mb-1 text-left text-left text-left">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100 text-left text-left text-left">{currentProject.code}</span>
                <h2 className="text-2xl font-black text-gray-900 text-left text-left text-left">{currentProject.name}</h2>
              </div>
              <p className="text-sm text-gray-500 font-medium text-left text-left text-left">Cliente: <span className="text-gray-800 text-left text-left text-left">{currentProject.client}</span> • <span className="italic text-left text-left text-left">{currentProject.location}</span></p>
            </div>
          </div>
          
          <div className="flex bg-gray-100/80 p-1.5 rounded-2xl w-fit self-end md:self-center backdrop-blur-sm text-left text-left">
            {[
              { id: 'budget', label: 'Presupuesto', icon: Layout },
              { id: 'team', label: 'Equipo', icon: Users },
              { id: 'reports', label: 'Reportes', icon: FileText },
              { id: 'settings', label: 'Configuración', icon: Settings }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === tab.id ? 'bg-white text-blue-600 shadow-md ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700'} text-left text-left text-left`}
              >
                <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'} text-left text-left`} /> {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 1. PRESUPUESTO */}
      {activeTab === 'budget' && (
        <div className="space-y-6 animate-in fade-in duration-300 text-left text-left text-left">
          <div className="flex items-center justify-between text-left text-left">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 text-left text-left">
              <FolderOpen className="h-5 w-5 text-blue-400 text-left text-left" /> Estructura de Capítulos
            </h3>
            {canModifyBudget && (
              <button 
                onClick={handleAddModule}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20 text-left text-left text-left"
              >
                <Plus className="h-4 w-4 text-left text-left" /> Añadir Capítulo
              </button>
            )}
          </div>

          {isModulesLoading ? (
            <div className="py-20 flex justify-center text-left text-left text-left"><Loader2 className="h-10 w-10 animate-spin text-blue-600 text-left text-left text-left" /></div>
          ) : modules?.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-md p-20 rounded-[40px] border-2 border-dashed border-white/10 text-center text-gray-400 text-left text-left text-left">
              <div className="bg-white/5 p-6 rounded-full w-fit mx-auto mb-4 text-left text-left">
                <Layout className="h-12 w-12 opacity-10 text-left text-left text-left" />
              </div>
              <p className="text-sm max-w-xs mx-auto italic text-left text-left text-left">El presupuesto está vacío. Comienza creando un capítulo.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 text-left text-left text-left">
              {modules?.sort((a,b) => a.order - b.order).map((mod) => (
                <div key={mod.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group text-left text-left text-left text-left">
                  <div 
                    onClick={() => toggleModule(mod.id)}
                    className={`p-6 flex items-center justify-between transition-all cursor-pointer ${expandedModules[mod.id] ? 'bg-blue-50/30' : 'hover:bg-gray-50'} text-left text-left text-left`}
                  >
                    <div className="flex items-center gap-5 flex-1 text-left text-left text-left text-left">
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black text-lg transition-all ${expandedModules[mod.id] ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-gray-100 text-gray-400'} text-left text-left text-left text-left`}>
                        {mod.order + 1}
                      </div>
                      <div className="text-left text-left text-left text-left text-left text-left">
                        <h4 className="font-bold text-gray-900 text-lg leading-tight mb-1 text-left text-left text-left text-left">{mod.name}</h4>
                        <p className="text-xs text-gray-500 font-medium text-left text-left text-left text-left">{mod.description || 'Sin descripción detallada'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8 text-left text-left text-left text-left">
                      <div className="text-right text-left text-left text-left text-left">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none text-left text-left text-left text-left">Subtotal Capítulo</p>
                        <p className="text-xl font-black text-gray-900 mt-1.5 text-left text-left text-left text-left">Bs. {mod.totalAmount.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity text-left text-left text-left text-left">
                        {canModifyBudget && (
                          <>
                            <button 
                              className="p-2.5 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-50 hover:bg-blue-700 transition-all flex items-center gap-2 text-xs font-bold text-left text-left text-left text-left"
                              onClick={(e) => { e.stopPropagation(); setImportModule({id: mod.id, name: mod.name}); }}
                            >
                              <PackagePlus className="h-4 w-4 text-left text-left text-left" /> Importar
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleDeleteModule(mod.id, mod.name); }}
                              className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all text-left text-left text-left text-left"
                            >
                              <Trash2 className="h-4 w-4 text-left text-left text-left" />
                            </button>
                          </>
                        )}
                        <div className={`ml-2 p-2 rounded-xl transition-all ${expandedModules[mod.id] ? 'bg-blue-100 text-blue-600 rotate-180' : 'bg-gray-100 text-gray-400'} text-left text-left text-left text-left`}>
                          <ChevronDown className="h-4 w-4 text-left text-left text-left text-left" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {expandedModules[mod.id] && (
                    <ModuleItemsTable 
                      moduleId={mod.id} 
                      projectId={id!} 
                      onViewAnalysis={(itemId, itemName, mid) => setAnalysisItem({id: itemId, name: itemName, moduleId: mid})}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Gran Total al Final de la Lista */}
          {modules && modules.length > 0 && (
            <div className="bg-[#0f172a] p-8 rounded-[40px] shadow-xl flex items-center justify-between mt-8 border border-white/5 animate-in slide-in-from-bottom-4 duration-500 text-left">
              <div className="text-left">
                <h4 className="text-blue-400 text-xs font-black uppercase tracking-[0.3em] mb-1">Cierre de Presupuesto</h4>
                <p className="text-white/60 text-[11px] font-medium leading-relaxed max-w-xs">Suma total de todos los capítulos y actividades registradas en la obra hasta el momento.</p>
                {b1Data?.totalLiteral && (
                  <p className="text-blue-200/50 text-[10px] mt-4 font-bold italic uppercase leading-tight max-w-sm">
                    {b1Data.totalLiteral}
                  </p>
                )}
              </div>
              <div className="text-right text-left">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Gran Total Obra</p>
                <p className="text-4xl font-black text-white mt-2">
                  <span className="text-blue-500 text-2xl mr-1">Bs.</span>
                  {(b1Data?.totalAmount || totalGeneral).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. EQUIPO */}
      {activeTab === 'team' && (
        <div className="space-y-6 animate-in fade-in duration-300 text-left text-left text-left">
          <div className="flex items-center justify-between text-left text-left text-left">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 text-left text-left text-left">
              <Users className="h-5 w-5 text-blue-400 text-left text-left text-left text-left text-left" /> Gestión de Colaboradores
            </h3>
            {canManageTeam && (
              <button 
                onClick={handleInvite}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg text-left text-left text-left"
              >
                <UserPlus className="h-4 w-4 text-left text-left text-left" /> Invitar Personal
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left text-left text-left">
            {isMembersLoading ? (
              <div className="col-span-full py-10 flex justify-center text-left text-left text-left"><Loader2 className="animate-spin text-blue-600 text-left text-left text-left" /></div>
            ) : members?.map((member) => (
              <div key={member.userId} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group text-left text-left text-left relative">
                <div className="flex items-center gap-4 text-left text-left text-left text-left text-left">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-bold text-sm ${member.isEncargado ? 'bg-amber-100 text-amber-700 border-2 border-amber-200 shadow-lg shadow-amber-50' : 'bg-blue-50 text-blue-600'} text-left text-left text-left`}>
                    {member.isEncargado ? <Crown className="h-6 w-6 text-left text-left text-left" /> : (member.fullName?.[0] || 'C')}
                  </div>
                  <div className="text-left text-left text-left text-left text-left">
                    <div className="flex items-center gap-2 text-left text-left text-left text-left text-left">
                      <h4 className="font-bold text-gray-900 text-left text-left text-left">{member.fullName || 'Colaborador Invitado'}</h4>
                      {member.isEncargado && <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-black rounded-lg uppercase tracking-tighter text-left text-left text-left">Encargado</span>}
                    </div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest text-left text-left">{member.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-left text-left text-left text-left">
                  <div className="flex items-center gap-1.5 mr-4 text-left text-left text-left text-left text-left">
                    <Shield className={`h-3.5 w-3.5 ${member.canEdit ? 'text-green-500' : 'text-gray-300'} text-left text-left text-left`} />
                    <Share2 className={`h-3.5 w-3.5 ${member.canShare ? 'text-blue-500' : 'text-gray-300'} text-left text-left text-left`} />
                  </div>
                  
                  {canManageTeam && !member.isEncargado && (
                    <div className="relative text-left text-left text-left" ref={activeMemberMenu === member.userId ? menuRef : null}>
                      <button 
                        onClick={() => setActiveMemberMenu(activeMemberMenu === member.userId ? null : member.userId)}
                        className={`p-2 rounded-xl transition-all ${activeMemberMenu === member.userId ? 'bg-gray-100 text-gray-900' : 'text-gray-300 hover:text-gray-900'}`}
                      >
                        <MoreVertical className="h-4 w-4 text-left text-left text-left text-left" />
                      </button>
                      
                      {activeMemberMenu === member.userId && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-left text-left text-left text-left">
                          <button onClick={() => handleUpdateMember(member)} className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 text-left text-left text-left">
                            <Settings2 className="h-3.5 w-3.5 text-left text-left text-left" /> Ajustar Privilegios
                          </button>
                          {(currentUser?.role === 'Empresa' || myMemberInfo?.isEncargado) && (
                            <button onClick={() => handleTransfer(member)} className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-amber-600 hover:bg-amber-50 text-left text-left text-left text-left">
                              <Crown className="h-3.5 w-3.5 text-left text-left text-left text-left" /> Hacer Encargado
                            </button>
                          )}
                          <hr className="my-1 border-gray-50 text-left text-left text-left" />
                          <button onClick={() => {/* Lógica de eliminar de obra si existe */}} className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 text-left text-left text-left">
                            <UserMinus className="h-3.5 w-3.5 text-left text-left text-left text-left" /> Quitar de Obra
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. REPORTES */}
      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-300 text-left">
          {/* B-1: Presupuesto */}
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between h-[340px] text-left">
            <div className="text-left">
              <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform text-left">
                <FileText className="h-8 w-8 text-left" />
              </div>
              <h4 className="text-xl font-black text-gray-900 mb-2 text-left">Formulario B-1</h4>
              <p className="text-xs text-gray-500 leading-relaxed font-medium text-left">Presupuesto General de Obra. Resume todos los capítulos y actividades con sus subtotales y literal.</p>
            </div>
            <button 
              onClick={handleDownloadB1}
              disabled={isDownloadingB1}
              className="w-full mt-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-3 disabled:opacity-50 text-left"
            >
              {isDownloadingB1 ? <Loader2 className="h-5 w-5 animate-spin text-left" /> : <Download className="h-5 w-5 text-left" />}
              {isDownloadingB1 ? 'Generando...' : 'Descargar B-1'}
            </button>
          </div>

          {/* B-2: APU Masivo (NUEVO) */}
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between h-[340px] text-left">
            <div className="text-left">
              <div className="h-14 w-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform text-left">
                <Calculator className="h-8 w-8 text-left" />
              </div>
              <h4 className="text-xl font-black text-gray-900 mb-2 text-left">APU Masivo (B-2)</h4>
              <p className="text-xs text-gray-500 leading-relaxed font-medium text-left">Análisis de Precios Unitarios de todo el proyecto. Genera un único PDF con una página por cada ítem.</p>
            </div>
            <button 
              onClick={handleDownloadProjectB2}
              disabled={isDownloadingProjectB2}
              className="w-full mt-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-3 disabled:opacity-50 text-left"
            >
              {isDownloadingProjectB2 ? <Loader2 className="h-5 w-5 animate-spin text-left" /> : <Download className="h-5 w-5 text-left" />}
              {isDownloadingProjectB2 ? 'Generando...' : 'Descargar APU Masivo'}
            </button>
          </div>

          {/* B-3: Insumos Consolidados (CON FILTROS) */}
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between h-[340px] text-left">
            <div className="text-left">
              <div className="h-14 w-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform text-left">
                <Printer className="h-8 w-8 text-left" />
              </div>
              <h4 className="text-xl font-black text-gray-900 mb-2 text-left">Formulario B-3</h4>
              <p className="text-xs text-gray-500 leading-relaxed font-medium mb-4 text-left">Listado consolidado de insumos. Puedes filtrar por tipo antes de exportar.</p>
              
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 text-left">Filtrar por Tipo</label>
                <select 
                  value={b3Filter}
                  onChange={(e) => setB3Filter(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-green-100 transition-all text-left"
                >
                  <option value="">Todos los insumos</option>
                  <option value="Materiales">Solo Materiales</option>
                  <option value="Obreros">Solo Mano de Obra</option>
                  <option value="Equipos">Solo Equipo y Maquinaria</option>
                </select>
              </div>
            </div>
            <button 
              onClick={handleDownloadB3}
              disabled={isDownloadingB3}
              className="w-full mt-8 py-4 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition-all shadow-lg shadow-green-100 flex items-center justify-center gap-3 disabled:opacity-50 text-left"
            >
              {isDownloadingB3 ? <Loader2 className="h-5 w-5 animate-spin text-left" /> : <Download className="h-5 w-5 text-left" />}
              {isDownloadingB3 ? 'Generando...' : 'Descargar B-3'}
            </button>
          </div>

          {/* Vista Previa de Insumos (JSON B-3) */}
          <div className="col-span-full">
            <B3ResourcesPreview projectId={id!} filter={b3Filter} />
          </div>
        </div>
      )}

      {/* 4. CONFIGURACIÓN */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300 text-left text-left text-left text-left">
          <div className="lg:col-span-8 text-left text-left text-left">
            <form onSubmit={handleSubmit(onSubmitParams)} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden text-left text-left text-left">
              <div className="px-8 py-6 border-b border-gray-50 text-left text-left text-left">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 text-left text-left text-left">
                  <Calculator className="h-5 w-5 text-blue-600 text-left text-left text-left" /> Parámetros impositivos y de Ley
                </h3>
                <p className="text-sm text-gray-500 mt-1 text-left text-left text-left">Configura las cargas sociales e impuestos específicos para {currentProject.name}.</p>
              </div>

              {isParamsLoading ? (
                <div className="p-20 flex flex-col items-center justify-center space-y-3 text-left text-left text-left text-left">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-200 text-left text-left text-left text-left" />
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest text-left text-left text-left text-left">Recuperando parámetros...</p>
                </div>
              ) : (
                <div className="p-8 space-y-8 text-left text-left text-left">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left text-left text-left text-left">
                    <div className="space-y-2 text-left text-left text-left text-left">
                      <label className="text-sm font-bold text-gray-700 text-left text-left text-left">Beneficios Sociales (%)</label>
                      <div className="relative text-left text-left text-left text-left">
                        <Percent className="absolute left-3 top-3 h-4 w-4 text-gray-400 text-left text-left text-left" />
                        <input {...register('socialBenefitsPercentage', { valueAsNumber: true })} type="number" step="0.01" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 outline-none font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 text-left text-left text-left" />
                      </div>
                    </div>
                    <div className="space-y-2 text-left text-left text-left text-left text-left">
                      <label className="text-sm font-bold text-gray-700 text-left text-left text-left">IVA (Mano de Obra) (%)</label>
                      <div className="relative text-left text-left text-left text-left text-left">
                        <Percent className="absolute left-3 top-3 h-4 w-4 text-gray-400 text-left text-left text-left" />
                        <input {...register('laborIVAPercentage', { valueAsNumber: true })} type="number" step="0.01" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 outline-none font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 text-left text-left text-left" />
                      </div>
                    </div>
                    <div className="space-y-2 text-left text-left text-left text-left text-left text-left">
                      <label className="text-sm font-bold text-gray-700 text-left text-left text-left">Utilidad (%)</label>
                      <div className="relative text-left text-left text-left text-left text-left text-left text-left">
                        <TrendingUp className="absolute left-3 top-3 h-4 w-4 text-green-500 text-left text-left text-left text-left" />
                        <input {...register('utilityPercentage', { valueAsNumber: true })} type="number" step="0.01" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 outline-none font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 text-left text-left text-left" />
                      </div>
                    </div>
                    <div className="space-y-2 text-left text-left text-left text-left text-left text-left">
                      <label className="text-sm font-bold text-gray-700 text-left text-left text-left">IT (%)</label>
                      <div className="relative text-left text-left text-left text-left text-left text-left text-left">
                        <Percent className="absolute left-3 top-3 h-4 w-4 text-gray-400 text-left text-left text-left" />
                        <input {...register('itPercentage', { valueAsNumber: true })} type="number" step="0.01" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 outline-none font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 text-left text-left text-left" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-50 flex justify-end text-left text-left text-left">
                <button type="submit" disabled={!isDirty || isUpdating} className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg disabled:opacity-50 text-left text-left text-left">
                  {isUpdating ? <Loader2 className="h-4 w-4 animate-spin text-left text-left text-left" /> : <Save className="h-4 w-4 text-left text-left text-left" />}
                  Guardar Configuración
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modales */}
      {importModule && (
        <ImportTemplatesModal 
          projectId={id!}
          moduleId={importModule.id}
          moduleName={importModule.name}
          onClose={() => setImportModule(null)}
        />
      )}

      {analysisItem && (
        <BudgetItemAnalysis 
          itemId={analysisItem.id}
          itemName={analysisItem.name}
          moduleId={analysisItem.moduleId}
          projectId={id!}
          onClose={() => setAnalysisItem(null)}
        />
      )}
    </div>
  );
};

export default ProjectDetail;
