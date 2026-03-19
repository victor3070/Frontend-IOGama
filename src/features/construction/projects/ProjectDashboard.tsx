import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Building2, 
  MoreVertical, 
  Calendar, 
  MapPin, 
  User, 
  TrendingUp, 
  Filter,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  LayoutGrid,
  List,
  Loader2
} from 'lucide-react';
import { useProjectsQuery, useDeleteProjectMutation, useUpdateProjectMutation } from '../../../hooks/queries/construction/useProjects';
import { ProjectStatus } from '../../../types/construction/project';
import type { ProjectDto } from '../../../types/construction/project';
import ProjectForm from './ProjectForm';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ProjectDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectDto | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: projects, isLoading } = useProjectsQuery();
  const { mutate: deleteProject } = useDeleteProjectMutation();
  const { mutate: updateProject } = useUpdateProjectMutation();

  const filteredProjects = projects?.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string, name: string) => {
    Swal.fire({
      title: '¿Eliminar Proyecto?',
      text: `Se borrará "${name}" permanentemente junto con todo su presupuesto.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#9ca3af',
      confirmButtonText: 'Sí, eliminar obra',
      cancelButtonText: 'Cancelar',
      customClass: { popup: 'rounded-3xl' }
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProject(id);
      }
    });
  };

  const handleChangeStatus = (project: ProjectDto, newStatus: ProjectStatus) => {
    updateProject({ id: project.id, data: { ...project, status: newStatus } });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 text-left">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Cargando portafolio...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 text-left">
        <div className="text-left">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight text-left">Portafolio de Obras</h2>
          <p className="text-gray-500 font-medium text-left">Gestiona y supervisa todos los proyectos de IO GAMA.</p>
        </div>
        <button 
          onClick={() => { setEditingProject(undefined); setIsFormOpen(true); }}
          className="flex items-center gap-2 px-8 py-3.5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
        >
          <Plus className="h-5 w-5" /> Nueva Obra
        </button>
      </div>

      {/* Barra de Herramientas */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between text-left">
        <div className="relative w-full md:w-96 text-left">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 text-left" />
          <input 
            type="text"
            placeholder="Buscar por nombre, código o cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-100 bg-white outline-none focus:ring-2 focus:ring-blue-100 transition-all text-sm font-medium"
          />
        </div>
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-gray-100 text-left">
          <button className="p-2.5 bg-gray-50 text-blue-600 rounded-xl shadow-sm"><LayoutGrid className="h-5 w-5 text-left" /></button>
          <button className="p-2.5 text-gray-400 hover:bg-gray-50 rounded-xl transition-all"><List className="h-5 w-5 text-left" /></button>
        </div>
      </div>

      {/* Grid de Proyectos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left text-left">
        {filteredProjects?.map((project) => (
          <div 
            key={project.id} 
            className="bg-white rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden flex flex-col h-full text-left"
          >
            {/* Status Badge */}
            <div className="absolute top-6 left-6 z-10 text-left text-left">
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                project.status === ProjectStatus.Active ? 'bg-green-50 text-green-700 border-green-100' :
                project.status === ProjectStatus.Draft ? 'bg-amber-50 text-amber-700 border-amber-100' :
                'bg-gray-50 text-gray-700 border-gray-100'
              } text-left text-left`}>
                {project.status === ProjectStatus.Active ? 'En Ejecución' : project.status}
              </span>
            </div>

            {/* Menu de Acciones */}
            <div className="absolute top-6 right-6 z-10 group/menu text-left text-left">
              <button className="p-2 bg-white/80 backdrop-blur-md rounded-xl text-gray-400 hover:text-gray-900 shadow-sm border border-gray-50 text-left">
                <MoreVertical className="h-5 w-5 text-left" />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 hidden group-hover/menu:block animate-in fade-in slide-in-from-top-2 duration-200 text-left text-left">
                <button 
                  onClick={() => { setEditingProject(project); setIsFormOpen(true); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
                >
                  <Edit3 className="h-4 w-4 text-left" /> Editar Información
                </button>
                {project.status === ProjectStatus.Draft && (
                  <button 
                    onClick={() => handleChangeStatus(project, ProjectStatus.Active)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-green-600 hover:bg-green-50 transition-colors text-left"
                  >
                    <CheckCircle2 className="h-4 w-4 text-left text-left" /> Iniciar Obra
                  </button>
                )}
                <hr className="my-1 border-gray-50 text-left" />
                <button 
                  onClick={() => handleDelete(project.id, project.name)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors text-left"
                >
                  <Trash2 className="h-4 w-4 text-left" /> Eliminar Proyecto
                </button>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-8 pt-20 flex-1 flex flex-col text-left text-left text-left">
              <div className="mb-6 text-left">
                <div className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1 text-left">Código: {project.code}</div>
                <h3 className="text-xl font-black text-gray-900 leading-tight group-hover:text-blue-600 transition-colors text-left">{project.name}</h3>
              </div>

              <div className="space-y-4 mb-8 text-left text-left">
                <div className="flex items-center gap-3 text-gray-500 text-left text-left text-left">
                  <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center text-left text-left">
                    <User className="h-4 w-4 text-left text-left" />
                  </div>
                  <div className="text-left text-left">
                    <p className="text-[10px] font-bold text-gray-400 uppercase leading-none text-left">Cliente</p>
                    <p className="text-xs font-bold text-gray-700 text-left">{project.client}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-500 text-left text-left text-left text-left">
                  <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center text-left text-left">
                    <MapPin className="h-4 w-4 text-left text-left" />
                  </div>
                  <div className="text-left text-left text-left">
                    <p className="text-[10px] font-bold text-gray-400 uppercase leading-none text-left">Ubicación</p>
                    <p className="text-xs font-bold text-gray-700 text-left">{project.location}</p>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between text-left">
                <div className="text-left text-left text-left">
                  <p className="text-[10px] font-black text-gray-400 uppercase text-left">Presupuesto</p>
                  <p className="text-lg font-black text-gray-900 text-left">
                    Bs. {(project.totalAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <button 
                  onClick={() => navigate(`/construction/projects/${project.id}`)}
                  className="px-6 py-2.5 bg-gray-900 text-white text-xs font-black rounded-xl hover:bg-blue-600 transition-all shadow-lg text-left"
                >
                  Abrir Gestión
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isFormOpen && (
        <ProjectForm 
          project={editingProject}
          onClose={() => { setIsFormOpen(false); setEditingProject(undefined); }} 
        />
      )}
    </div>
  );
};

export default ProjectDashboard;
