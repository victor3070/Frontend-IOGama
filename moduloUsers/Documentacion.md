# Documentación Técnica - ERP IO GAMA Construcciones

Esta documentación detalla la implementación del sistema frontend, dividida por fases de desarrollo.

---

## 🛡️ Fase 1: Núcleo de Autenticación y Seguridad

### 1. Arquitectura de Autenticación
El sistema utiliza un flujo basado en **JWT (JSON Web Tokens)** con estrategia de **Refresh Token**.
- **Zustand**: Gestiona el estado global de tokens y datos básicos del usuario.
- **Axios Interceptors**: Inyectan automáticamente el token de acceso y gestionan la renovación automática en caso de errores `401 Unauthorized`.

---

## 🏗️ Fase 2: Layout Base y Contexto del Usuario

### 1. Gestión de Estado Híbrida
- **Estado de UI (`uiStore.ts`)**: Gestionado con **Zustand** para la interactividad visual (Sidebar).
- **Estado del Servidor**: Gestionado con **@tanstack/react-query** para caching e invalidación de datos.

### 2. Componentes Corporativos
- **Sidebar y Navbar**: Integración con el perfil real del usuario, manejando carga diferida (Skeletons) y errores de red en imágenes.

---

## 👥 Fase 3: Gestión de Empleados y Seguridad Granular

### 1. Administración de Personal (`EmployeeList.tsx`)
Se implementó una tabla administrativa robusta con las siguientes capacidades:
- **Búsqueda y Filtrado**: Filtros por estado (Activo/Suspendido) y búsqueda por nombre/email.
- **Gestión de Estado (HU-FRONT-13)**: Cambio dinámico de estado entre "Activo" y "Suspendido" con confirmación de seguridad vía SweetAlert2.
- **Reseteo de Credenciales (HU-FRONT-14)**: Funcionalidad para establecer nuevas contraseñas temporales a los empleados directamente desde la tabla.

### 2. Registro de Empleados (`CreateEmployee.tsx`)
- Formulario de dos pasos con validaciones estrictas vía **Zod**.
- Asignación de roles iniciales y generación de credenciales.

### 3. Matriz de Seguridad Refinada (HU-FRONT-15)
Se desarrolló una vista avanzada de permisos (`EmployeePermissions.tsx`) con las siguientes características:
- **Modelo de Diccionario**: Los permisos se estructuran como un mapa de módulos, permitiendo escalabilidad.
- **Control Granular**: Habilitación de módulos completos y selección de funcionalidades específicas (ej. `PROJECT_CREATE`, `BUDGET_EDIT`).
- **Sincronización Multi-API**:
  - Los datos personales residen en `UserManagement.API`.
  - Los permisos granulares se sincronizan con `Construction.API` mediante una operación de **Upsert (POST)**.
- **UX Adaptativa**: Bloqueo automático de funcionalidades internas cuando el acceso al módulo principal está desactivado.

---

## 📊 Fase 4: Ingeniería de Costos y Reportes Dinámicos

### 1. Integración de Formularios de Ley (B-1, B-2, B-3)
Se refactorizó la capa de servicios (`report.service.ts`) para alinearse con los nuevos estándares de `Construction.API`:
- **Formulario B-1 (Presupuesto General)**: Integración del campo `totalLiteral` y sincronización del Gran Total oficial del backend.
- **Formulario B-2 (Análisis de Precios Unitarios - APU)**: 
    - Implementación de la fórmula legal del IVA: `(Subtotal Mano de Obra + Cargas Sociales) * %LaborIVA`.
    - Visualización persistente de impuestos (IT, IVA, Utilidad) incluso en valores `0.00` con estilo tenue (`opacity-50`).
    - Generación de Literal para el Precio Unitario Final.
- **Formulario B-3 (Insumos Consolidados)**:
    - Implementación de **Previsualización JSON** antes de la descarga.
    - Sistema de filtrado por categorías: Materiales, Obreros y Equipos.

### 2. Sincronización y Reactividad Avanzada
Se optimizó el uso de **TanStack Query** para garantizar la integridad de los datos en tiempo real:
- **Invalidación en Cascada**: Las mutaciones en ítems o recursos disparan automáticamente el refresco de los reportes B-1 y B-2.
- **Null-Safety**: Implementación de validaciones de seguridad en componentes de alto cálculo para prevenir colapsos por datos incompletos del servidor.

### 3. Catálogo Vivo en APU
- Integración del buscador de insumos maestro dentro del editor de APU, permitiendo la construcción dinámica de análisis mediante la inserción directa de recursos del catálogo.

---

## ✨ Mejoras de Experiencia de Usuario (UX)

### 1. Estandarización Visual de Confirmaciones
- Se refactorizaron todas las llamadas a **SweetAlert2** para adoptar el estándar de diseño `rounded-[32px]`.
- Implementación de flujos de confirmación para acciones críticas: Guardar configuración, Iniciar Obra, Eliminar elementos y Transferir liderazgo.

### 2. Optimización de Menús de Acción
- **Cambio de Paradigma**: Los menús de "tres puntos" (Portafolio de Obras y Lista de Empleados) migraron de un comportamiento por `hover` a un sistema basado en **clic con persistencia de estado**.
- **Solución de Bugs**: Se eliminaron las animaciones agresivas y el cierre accidental de opciones, garantizando una navegación fluida y precisa.

### 3. Gestión de Descargas
- Inclusión de alertas informativas antes de la generación de archivos PDF para gestionar las expectativas de tiempo de procesamiento del servidor.

---

## 🛠️ Stack Tecnológico
- **Framework**: Vite + React + TypeScript.
- **UI/UX**: Tailwind CSS + Lucide React.
- **Server State**: TanStack Query (React Query).
- **Feedback**: Sileo (Toasts) + SweetAlert2 (Modales interactivos).

---

**Última actualización:** 18 de Marzo de 2026
**Estado General:** Sprint de Reportes e Ingeniería de Costos finalizado. Sistema de confirmaciones y UX optimizado.
