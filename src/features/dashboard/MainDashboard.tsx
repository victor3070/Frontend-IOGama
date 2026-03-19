import React from 'react';
import { 
  Building2, 
  Users, 
  Layers, 
  TrendingUp, 
  Plus, 
  ArrowRight, 
  Briefcase,
  Wallet,
  Clock,
  CheckCircle2,
  Package
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProjectsQuery } from '../../hooks/queries/construction/useProjects';
import { useEmployees } from '../../hooks/queries/useEmployees';
import { useResourcesQuery } from '../../hooks/queries/construction/useResources';
import { ProjectStatus } from '../../types/construction/project';

const MainDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // Queries reales
  const { data: projects, isLoading: isLoadingProjects } = useProjectsQuery();
  const { data: employees, isLoading: isLoadingEmployees } = useEmployees();
  const { data: resources, isLoading: isLoadingResources } = useResourcesQuery(1, 1);

  const stats = [
    { 
      label: 'Total de Proyectos', 
      value: isLoadingProjects ? '...' : projects?.length || 0, 
      icon: Building2, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    },
    { 
      label: 'Personal en Nómina', 
      value: isLoadingEmployees ? '...' : employees?.length || 0, 
      icon: Users, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50' 
    },
    { 
      label: 'Recursos en Catálogo', 
      value: isLoadingResources ? '...' : (resources?.length || 0) > 0 ? '+100' : '0', 
      icon: Package, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50' 
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 text-left">
      {/* Bienvenida y Acción Principal */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8 text-left">
        <div className="text-left">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight text-left">Panel de Control</h1>
          <p className="text-slate-500 font-medium mt-2 text-left">Visión general del portafolio y recursos de IO GAMA.</p>
        </div>
        <div className="flex items-center gap-3 text-left">
          <button 
            onClick={() => navigate('/construction/projects')}
            className="flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-all shadow-sm text-left"
          >
            Explorar Portafolio
          </button>
          <button 
            onClick={() => navigate('/construction/projects')}
            className="flex items-center gap-2 px-8 py-3.5 bg-[#0f172a] text-white font-black rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 text-left"
          >
            <Plus className="h-5 w-5 text-left" /> Nueva Obra
          </button>
        </div>
      </div>

      {/* Grid de Estadísticas Simplificado */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group text-left">
            <div className={`h-14 w-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-left text-left text-left`}>
              <stat.icon className="h-7 w-7 text-left text-left" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-left text-left">{stat.label}</p>
            <p className="text-4xl font-black text-slate-900 mt-2 text-left text-left">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 text-left">
        {/* Proyectos Críticos */}
        <div className="lg:col-span-8 space-y-6 text-left">
          <div className="flex items-center justify-between px-2 text-left">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-3 text-left">
              <Briefcase className="h-6 w-6 text-blue-600 text-left" /> Obras en Ejecución
            </h3>
            <button onClick={() => navigate('/construction/projects')} className="text-xs font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest text-left">Ver portafolio completo</button>
          </div>
          
          <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden text-left">
            <div className="divide-y divide-slate-50 text-left">
              {projects?.slice(0, 5).map((project) => (
                <div 
                  key={project.id} 
                  className="p-6 hover:bg-slate-50/50 transition-colors flex items-center justify-between group cursor-pointer text-left" 
                  onClick={() => navigate(`/construction/projects/${project.id}`)}
                >
                  <div className="flex flex-col text-left">
                    <div className="flex items-center gap-2 mb-1 text-left">
                      <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100 text-left">{project.code}</span>
                      <h4 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-blue-600 transition-colors text-left">{project.name}</h4>
                    </div>
                    <p className="text-sm text-slate-400 font-medium ml-1 text-left">Cliente: {project.client}</p>
                  </div>
                  
                  <div className="flex items-center gap-8 text-left">
                    <div className="hidden md:block text-right text-left">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest text-left">Monto Total</p>
                      <span className="text-sm font-black text-slate-900 text-left">Bs. {(project.totalAmount || 0).toLocaleString()}</span>
                    </div>
                    <div className="h-10 w-10 rounded-full border border-slate-100 flex items-center justify-center group-hover:border-blue-200 transition-all text-left">
                      <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all text-left" />
                    </div>
                  </div>
                </div>
              ))}
              {(!projects || projects.length === 0) && (
                <div className="p-20 text-center text-slate-400 italic font-medium text-left">No se encontraron obras registradas en el servidor.</div>
              )}
            </div>
          </div>
        </div>

        {/* Accesos y Guía */}
        <div className="lg:col-span-4 space-y-8 text-left">
          <div className="bg-[#0f172a] p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden text-left">
            <div className="relative z-10 text-left text-left">
              <div className="flex items-center gap-3 mb-6 text-left text-left">
                <div className="h-10 w-10 bg-blue-600 rounded-2xl flex items-center justify-center text-left">
                  <TrendingUp className="h-6 w-6 text-left text-left" />
                </div>
                <h3 className="text-xl font-black text-left">Ingeniería</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium text-left">
                Accede rápidamente al catálogo de recursos para actualizar precios maestros.
              </p>
              <button 
                onClick={() => navigate('/construction/resources')}
                className="w-full py-4 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all border border-white/10 text-left flex justify-center"
              >
                Catálogo de Insumos
              </button>
            </div>
            <Layers className="absolute -bottom-6 -right-6 h-40 w-40 text-white/[0.03] text-left" />
          </div>

          <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm text-left">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2 text-left">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 text-left" /> Acciones Rápidas
            </h4>
            <div className="grid grid-cols-1 gap-3 text-left">
              <button onClick={() => navigate('/employees')} className="flex items-center gap-4 p-4 rounded-3xl border border-slate-50 hover:bg-slate-50 transition-all group text-left">
                <div className="h-10 w-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform text-left">
                  <Users className="h-5 w-5 text-left" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-800 text-left">Gestionar Equipo</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase text-left">Nómina y Accesos</p>
                </div>
              </button>
              
              <button onClick={() => navigate('/construction/units')} className="flex items-center gap-4 p-4 rounded-3xl border border-slate-50 hover:bg-slate-50 transition-all group text-left">
                <div className="h-10 w-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform text-left">
                  <Clock className="h-5 w-5 text-left" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-800 text-left">Unidades de Medida</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase text-left">Configuración Base</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
