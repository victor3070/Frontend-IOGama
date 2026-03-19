# 📄 Documento de Requerimientos del Producto (PRD) - IO GAMA ERP

**Estado:** Versión 2.0 (Maestro)  
**Proyecto:** ERP de Ingeniería de Costos y Gestión de Obras  
**Empresa:** IO GAMA Construcciones S.R.L.  
**Última Actualización:** Marzo 2026

---

## 1. Visión del Producto
IO GAMA es un ERP especializado en **Ingeniería de Costos** diseñado para constructoras modernas. A diferencia de un ERP genérico, IO GAMA se centra en la precisión de los **Análisis de Precios Unitarios (APU)**, la gestión jerárquica de presupuestos y la generación de reportes oficiales (Formularios B-1, B-2, B-3).

---

## 2. Arquitectura del Sistema (Smart Ecosystem)

### 2.1. Gateway Inteligente (YARP)
- **Centralización:** Actúa como el único punto de entrada (`https://localhost:7149`).
- **Seguridad:** Validación de firmas JWT y enrutamiento basado en módulos (`/api/users` y `/api/construction`).
- **Case Sensitivity:** Configuración estricta de rutas en PascalCase para asegurar el ruteo hacia microservicios ASP.NET Core.

### 2.2. Modelo de Identidad (UserManagement)
- **Single-Tenant Core:** Optimizado para la organización IO GAMA Principal.
- **Jerarquía de Usuarios:**
  - `Empresa`: Dueño total del ecosistema.
  - `SubCuentaEmpresa (SuperAdmin)`: Personal administrativo con poder total.
  - `Empleado (Colaborador)`: Personal técnico con acceso limitado por obra.
- **Seguridad en Dos Capas:**
  1. **Global:** Permisos generales (ej. "¿Puede crear obras?").
  2. **Local (Project-Level):** Permisos específicos por proyecto (ej. "En la Obra X solo puede ver").

---

## 3. Funcionalidades Maestras

### 3.1. Gestión de Colaboración Batch (v4)
- **Invitación Masiva:** Permite incorporar múltiples empleados a un proyecto en una sola operación atómica.
- **Roles de Ingeniería:**
  - `Admin`: Control total del presupuesto y gestión de equipo.
  - `Resident`: Responsable técnico de la ejecución y APUs.
  - `Supervisor`: Rol de auditoría y revisión de costos.
  - `Viewer`: Consultor sin capacidad de modificación.
- **Filtro Automático:** Los empleados solo visualizan en su portafolio las obras donde han sido invitados activamente.

### 3.2. Ingeniería de Presupuestos (APU)
- **Estructura Jerárquica:** Proyecto > Capítulos (Módulos) > Actividades (Ítems).
- **Matriz APU Dinámica:** 
  - Cálculo en tiempo real de Materiales, Mano de Obra y Equipos.
  - Aplicación automática de Cargas Sociales (55%), IVA s/ Mano de Obra, Herramientas Menores (5%), Gastos Generales, Utilidad e IT.
- **Importación de Plantillas:** Capacidad de clonar actividades desde el Catálogo Maestro al presupuesto específico de la obra.

### 3.3. Centro de Reportes (QuestPDF)
Generación de documentos PDF oficiales con validez legal:
- **Formulario B-1:** Presupuesto por Ítems y General (Resumen ejecutivo).
- **Formulario B-2:** Análisis de Precio Unitario (Ficha técnica detallada por actividad).
- **Formulario B-3:** Precios Unitarios Elementales (Consolidado de insumos de toda la obra).

---

## 4. Experiencia de Usuario (UX/UI)

### 4.1. Estética "Industrial Minimalista"
- **Paleta de Colores:** Fondo `slate-100` (gris azulado suave), acentos en `blue-600` y fondos de tarjeta blanco puro.
- **Descanso Visual:** Diseño optimizado para largas jornadas de trabajo de ingeniería, evitando el blanco puro absoluto.
- **Componentes Premium:** Tarjetas con radios de borde de `40px` y sombras suaves (`shadow-xl`).

### 4.2. Dashboard Gerencial
- **KPIs en Tiempo Real:** Total de Proyectos, Personal en Nómina y Recursos en Catálogo.
- **Visualización de Portafolio:** Tarjetas de proyecto con montos de inversión reales y acceso directo a la gestión técnica.

### 4.3. Perfil Corporativo
- **Gestión de Identidad:** Carga de fotos de perfil (Base64), biografía corporativa y sincronización instantánea con el Navbar.
- **Feedback Continuo:** Uso de **SweetAlert2** para confirmación de acciones críticas (suspender usuarios, eliminar obras, guardar presupuestos).

---

## 5. Especificaciones Técnicas (Stack)
- **Frontend:** React 18 + TypeScript + Vite.
- **Estilos:** Tailwind CSS + Lucide Icons.
- **Estado Global:** Zustand (Auth) + React Query (Server State).
- **Formularios:** React Hook Form + Zod (Validation).
- **Integración:** Axios con interceptores para Refresh Token y soporte de Blobs para PDFs.

---

## 6. Roadmap de Seguridad
1. **Limpieza de Sesión:** Al cerrar sesión, el sistema ejecuta un `queryClient.clear()` preventivo.
2. **Protección de Rutas:** Implementación de `ProtectedRoute` y `RoleRoute` para validar accesos antes de renderizar componentes.
3. **Persistencia:** Tokens almacenados de forma segura con lógica de auto-login mediante Refresh Token.

---
*Documento propiedad de IO GAMA Construcciones. Prohibida su reproducción sin autorización del departamento de TI.*
