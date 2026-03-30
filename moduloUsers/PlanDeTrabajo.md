# Plan de Trabajo - Refactorización Frontend de Reportes (Formularios B-1, B-2, B-3)

## Objetivos Principales
Alinear el frontend (servicios, hooks y componentes de React) con los cambios recientes en `Construction.API` para los reportes de APU, presupuestos consolidados y manejo de PDFs.

## Paso 1: Limpieza de Código Obsoleto
- Buscar y eliminar llamadas al endpoint obsoleto `GET /api/items/{id}/analysis`. 
- Revisar y limpiar `src/services/construction/item.service.ts` y `src/services/construction/report.service.ts` de rutas y métodos huérfanos referentes a analysis o apu viejo.
- Limpiar hooks (`useItems.ts`, `useReports.ts`) que apunten a este viejo endpoint o métodos no existentes.

## Paso 2: Formulario B-1 (Presupuesto General)
- **Servicio (`report.service.ts`):** 
  - Validar y asegurar que el JSON venga de `GET /api/Reports/projects/{projectId}/budget`.
  - Validar descarga de PDF desde `GET /api/Reports/projects/{projectId}/budget/pdf`. Manejar la respuesta con Token y formato Blob.
- **Hook (`useReports.ts`):**
  - Asegurar que `useB1DataQuery` y la mutación de PDF apunten a los servicios correctos.
- **Componente (`src/features/construction/projects/...`):**
  - Identificar la vista donde se muestra el B-1.
  - Asegurarse de renderizar el campo `totalLiteral` que ahora devuelve el backend.

## Paso 3: Formulario B-2 (Análisis de Precios Unitarios - APU)
- **Servicio (`report.service.ts`):**
  - Integrar la obtención de datos crudos: `GET /api/Reports/items/{itemId}/unit-price-analysis` (Esto reemplaza el análisis antiguo).
  - Integrar PDF individual: `GET /api/Reports/items/{itemId}/unit-price-analysis/pdf`.
  - Integrar PDF masivo por proyecto: `GET /api/Reports/projects/{projectId}/unit-price-analysis/pdf`.
- **Tipos/DTOs:**
  - Actualizar o crear la interfaz para la respuesta del B-2 (`B2ReportDto` o `UnitPriceAnalysisDto`).
- **Hook (`useReports.ts`):**
  - Conectar los nuevos endpoints para obtener los datos de análisis y descargar los PDFs.
- **Componente (`BudgetItemAnalysis.tsx` o vista respectiva):**
  - Reflejar la fórmula del IVA actualizada: `IVA = (SubtotalMO + CargasSociales) * %LaborIVA`.
  - Manejar visualmente cuando los impuestos (`IT`, `IVA`) vengan en `0.00` para que se muestren correctamente y no se asuma que no existen.

## Paso 4: Formulario B-3 (Precios Unitarios Elementales)
- **Servicio (`report.service.ts`):**
  - Integrar JSON: `GET /api/Reports/projects/{projectId}/consolidated-resources` (Pasando query param `filter`).
  - Integrar PDF: `GET /api/Reports/projects/{projectId}/consolidated-resources/pdf`.
- **Hook (`useReports.ts`):**
  - Verificar mutaciones y queries de B-3, conectándolos al servicio e incluyendo el `filter`.
- **Componentes:**
  - Integrar correctamente la tabla de consolidados de recursos y la visualización PDF.

## Estrategia de Ejecución
Ejecutar el plan en orden, validando a nivel de tipos (TypeScript) y luego modificando las capas: Types -> Services -> Hooks -> Componentes. Cada paso será documentado a medida que se vaya implementando.
