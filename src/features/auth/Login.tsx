import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Mail, 
  Lock, 
  Loader2, 
  ArrowRight
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useQueryClient } from '@tanstack/react-query';

const loginSchema = z.object({
  email: z.string().email('Introduce un correo electrónico válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const setTokens = useAuthStore((state) => state.setTokens);
  const setUserData = useAuthStore((state) => state.setUserData);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    queryClient.clear();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_GATEWAY_URL}/api/users/Auth/login`,
        data
      );

      const { token, refreshToken, userId, userContext } = response.data;

      setTokens(token, refreshToken);
      setUserData({
        id: userId,
        email: data.email,
        role: userContext.userType,
        type: userContext.userType,
        profileName: userContext.profile.name,
        fotoUrl: userContext.profile.fotoUrl,
      });

      navigate('/');
    } catch (error: any) {
      const status = error.response?.status;
      if (status === 401) {
        Swal.fire({ 
          title: 'Acceso Denegado', 
          text: 'Credenciales no válidas', 
          icon: 'error', 
          confirmButtonColor: '#0f172a',
          customClass: { popup: 'rounded-[32px]' }
        });
      } else {
        Swal.fire({ 
          title: 'Error de Sistema', 
          text: 'Servidor fuera de línea', 
          icon: 'question', 
          confirmButtonColor: '#0f172a',
          customClass: { popup: 'rounded-[32px]' }
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[#0f172a] flex items-center justify-center p-6 text-left selection:bg-blue-500/20">
      <div className="w-full max-w-[620px] animate-in fade-in duration-800">
        
        <div className="bg-white p-10 md:p-12 rounded-[32px] shadow-2xl border border-white/5 text-left">
          
          {/* Header Corporativo */}
          <div className="mb-12 text-left">
            <div className="flex items-center gap-4 mb-8">
              <img src="/img/icono.png" alt="Logo" className="h-12 w-12" />
              <div className="h-8 w-[1px] bg-slate-200"></div>
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tighter leading-tight">
                  IO GAMA <span className="text-blue-600 block text-xs tracking-[0.4em] font-black uppercase mt-0.5">CONSTRUCCIONES</span>
                </h1>
              </div>
            </div>
            
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Acceso al Sistema</h2>
              <p className="text-sm text-slate-500 font-medium">Ingresa tus credenciales para acceder al panel de control</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identidad Corporativa</label>
              <div className="relative group text-left">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <input
                  {...register('email')}
                  type="email"
                  className={`w-full pl-11 pr-4 py-3.5 bg-slate-50 border ${errors.email ? 'border-red-200' : 'border-slate-100'} rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-slate-700 text-sm`}
                  placeholder="usuario@gama.com"
                />
              </div>
              {errors.email && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-left">Clave de Acceso</label>
              <div className="relative group text-left">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <input
                  {...register('password')}
                  type="password"
                  className={`w-full pl-11 pr-4 py-3.5 bg-slate-50 border ${errors.password ? 'border-red-200' : 'border-slate-100'} rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-slate-700 text-sm`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0f172a] hover:bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-3 group active:scale-[0.98] disabled:opacity-50 text-left"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Ingresar al Panel
                  <ArrowRight className="h-4 w-4 opacity-50 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-12 pt-8 border-t border-slate-50 flex items-center justify-between">
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">© 2026 IO GAMA</p>
            <div className="flex gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
              <div className="h-1.5 w-1.5 rounded-full bg-slate-200"></div>
              <div className="h-1.5 w-1.5 rounded-full bg-slate-200"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
