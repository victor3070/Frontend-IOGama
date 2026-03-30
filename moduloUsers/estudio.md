# Documentación Técnica: Frontend IO GAMA - Conexión Backend

Esta documentación detalla la arquitectura, el flujo de datos y la integración del frontend de **IO GAMA** con su ecosistema de microservicios. Está diseñada para proporcionar un contexto completo sobre cómo se gestiona la información, la seguridad y la operatividad del sistema.

---

## 1. Arquitectura General y Tecnologías

El proyecto sigue una arquitectura de **Microservicios** comunicados a través de un **API Gateway**. El frontend actúa como el orquestador visual que consume estos servicios.

### **Tech Stack Principal**
- **Framework:** React 19 (TypeScript) + Vite.
- **Estado Global:** [Zustand](https://github.com/pmndrs/zustand) (Ligero, rápido y persistente).
- **Data Fetching:** [TanStack Query v5](https://tanstack.com/query/latest) (Caché inteligente y sincronización de estado del servidor).
- **Estilos:** Tailwind CSS (Diseño utilitario y responsivo).
- **Formularios:** React Hook Form + Zod (Validación tipada en tiempo real).
- **Comunicación:** Axios (Configurado con interceptores de seguridad).
- **Componentes UI:** Lucide React (Iconografía) y SweetAlert2 (Notificaciones interactivas).

---

## 2. Capa de Comunicación (Axios & Interceptores)

La conexión con el backend se centraliza en `src/config/api.ts`. Esta capa es crítica para la seguridad y la multi-tenencia.

### **Configuración Base**
- **Base URL:** Extraída de `VITE_API_GATEWAY_URL`.
- **Tenant ID:** Se inyecta el encabezado `X-Tenant-ID` y `tenant-id` en cada petición. Esto permite al backend identificar a qué empresa pertenecen los datos, manteniendo el aislamiento de la información.

### **Interceptores de Seguridad**
1.  **Request Interceptor:** Inyecta automáticamente el JWT (`Bearer Token`) recuperado del `authStore` de Zustand.
2.  **Response Interceptor (Manejo de 401):** 
    - Si un token expira (401), el sistema intenta un **Silent Refresh**.
    - Utiliza una cola (`failedQueue`) para pausar las peticiones entrantes mientras se obtiene un nuevo token.
    - Si el refresh falla, redirige automáticamente al `/login` y limpia la sesión.

---

## 3. Seguridad y Flujo de Autenticación

El sistema utiliza un flujo de **JWT (JSON Web Tokens)** con persistencia en `localStorage`.

### **Proceso de Login (`Auth/login`)**
- El usuario envía `email` y `password`.
- El backend devuelve: `token`, `refreshToken`, `userId` y `userContext`.
- `userContext` contiene metadatos del perfil: rol, nombre, URL de foto y tipo de usuario.
- Los tokens se guardan de forma segura para futuras peticiones.

### **Restauración de Sesión (`initialize`)**
Al recargar la página, el frontend no pide credenciales de nuevo. Utiliza el `refreshToken` guardado para solicitar un nuevo set de tokens de acceso de forma transparente para el usuario.

### **Protección de Rutas**
- **`ProtectedRoute`:** Bloquea el acceso a usuarios no autenticados.
- **`RoleRoute`:** Filtra el acceso según el `userType` (Administrador, Ingeniero, etc.).

---

## 4. Inventario de Endpoints por Microservicio

El sistema consume dos microservicios principales a través del Gateway:

### **A. Microservicio de Usuarios y Empresa (`/api/users`)**
Gestiona la identidad corporativa y el personal.

| Operación | Método | Endpoint | Descripción |
| :--- | :--- | :--- | :--- |
| Login | `POST` | `/api/users/Auth/login` | Autenticación inicial. |
| Refresh Token | `POST` | `/api/users/Auth/refresh-token` | Renovación de sesión expirada. |
| Listar Empleados | `GET` | `/api/users/api/CompanyManagement/employees` | Obtiene el personal de la empresa. |
| Detalle Empleado | `GET` | `/api/users/api/CompanyManagement/employees/{id}` | Información extendida del usuario. |
| Actualizar Permisos | `PUT` | `/api/users/api/CompanyManagement/employees/{id}/permissions` | Permisos a nivel plataforma. |
| Reset Password | `PUT` | `/api/users/api/CompanyManagement/employees/{id}/reset-password` | Cambio forzado de clave. |

### **B. Microservicio de Construcción (`/api/construction`)**
Núcleo de la lógica de ingeniería y presupuestos.

#### **Proyectos y Módulos**
- `GET /api/construction/api/Projects`: Lista todos los proyectos del Tenant activo.
- `GET /api/construction/api/projects/{id}/modules`: Módulos estructurales del proyecto.
- `PUT /api/construction/api/Projects/{id}/parameters`: Configuración de Ley Social, IVA e imprevistos.

#### **Catálogo de Recursos (APU)**
- `GET /api/construction/api/Resources`: Maestro de materiales, mano de obra y equipo.
- `GET /api/construction/api/Resources/search`: Búsqueda reactiva por términos parciales.
- `POST /api/construction/api/Resources`: Creación de nuevos recursos para la base de datos.

#### **Presupuesto y Análisis de Precios (Items)**
- `GET /api/construction/api/modules/{moduleId}/items`: Ítems de presupuesto vinculados a un módulo.
- `POST /api/construction/api/items/{itemId}/resources/custom`: Inserción de recursos específicos al análisis de un ítem.
- `PUT /api/construction/api/items/{itemId}/resources/{resourceId}`: Ajuste de rendimientos y desperdicios.

#### **Reportes y Exportación (PDF)**
El frontend utiliza `responseType: 'blob'` para descargar documentos generados en tiempo real por el servidor:
- `Formulario B-1`: Presupuesto General.
- `Formulario B-2`: Análisis de Precios Unitarios (Individual o Masivo).
- `Formulario B-3`: Consolidado de Insumos (Materiales, Mano de Obra, Equipo).

---

## 5. Gestión de Permisos Granulares

A diferencia de los roles básicos, IO GAMA implementa una matriz de permisos técnica en el microservicio de construcción:
- **`Permissions/me`**: El frontend consulta este endpoint para saber qué acciones (Editar, Eliminar, Ver Costos) puede realizar el usuario actual en el módulo técnico.
- Esto permite que un usuario sea "Ingeniero" pero no tenga permiso para modificar el presupuesto de una obra específica.

---

## 6. Estructura de Datos (Tipado)

Toda la comunicación está estrictamente tipada en `src/types/`.
- **Dto (Data Transfer Objects):** Representan fielmente la respuesta del Swagger del backend.
- **Requests:** Objetos específicos para envíos de datos (Creación/Edición).

---

## 7. Flujo de Trabajo (Resumen)

1. **Carga de Datos:** Los hooks de React Query (ej. `useProjects`) llaman a los servicios (`projectService`).
2. **Caché:** Los datos se guardan en caché local para evitar peticiones redundantes.
3. **Acciones:** Al crear un recurso, se usa `mutate` de React Query, lo que dispara una actualización automática de la UI al invalidar las claves de caché correspondientes.
4. **Validación:** Zod asegura que los datos enviados al backend cumplan con los esquemas de la base de datos antes de salir del navegador.

---
*Documento generado para fines de estudio y auditoría de software.*
