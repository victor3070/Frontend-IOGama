import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../../services/profile.service';
import Swal from 'sweetalert2';
import { sileo } from 'sileo';
import type { UpdateProfileRequest } from '../../types/profile';

export const profileKeys = {
  all: ['profile'] as const,
  me: () => [...profileKeys.all, 'me'] as const,
};

export const useProfile = () => {
  return useQuery({
    queryKey: profileKeys.me(),
    queryFn: profileService.getMe,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => profileService.updateProfile(data),
    onSuccess: () => {
      // Invalida la query para refrescar los datos en toda la UI
      queryClient.invalidateQueries({ queryKey: profileKeys.me() });
      
      Swal.fire({
        title: '¡Perfil Actualizado!',
        text: 'Tus cambios han sido guardados correctamente.',
        icon: 'success',
        confirmButtonColor: '#2563eb', // blue-600
        customClass: {
          popup: 'rounded-[32px]',
        }
      });
    },
    onError: (error: any) => {
      sileo.error({
        title: 'Error al actualizar',
        description: error.response?.data?.message || 'No se pudieron guardar los cambios.'
      });
    }
  });
};
