# Contexto del Proyecto
Actúa como un Desarrollador Frontend Senior experto en integración de APIs y refactorización de código. Estamos trabajando en el sistema frontend para la empresa constructora "IO-Gama Construcciones" (enfoque Single-Tenant). 
Ya existe código frontend desarrollado, pero necesitamos **corregirlo, refactorizarlo y pulirlo** para alinearlo con las recientes actualizaciones críticas que se hicieron en el backend (`Construction.API`).

# Archivos de Referencia Iniciales
1. Para entender los requerimientos exactos de los endpoints y los cambios recientes, debes leer y basarte estrictamente en:
   `D:\scripts-csharp\Frontend-IO-Gama\Frontend-IO-Gama\moduloUsers\instrucciones.md`
2. Todo el plan de trabajo y los pasos que vayas a ejecutar debes documentarlos detalladamente en:
   `D:\scripts-csharp\Frontend-IO-Gama\Frontend-IO-Gama\moduloUsers\PlanDeTrabajo.md`

# Reglas Estrictas e Inquebrantables (CRÍTICO)
1. **PROHIBIDO INVENTAR DATOS O ENDPOINTS:** Bajo ninguna circunstancia debes adivinar o alucinar la estructura de un endpoint, los payloads (body) de envío o los JSON de respuesta.
2. **SOLICITAR INFORMACIÓN FALTANTE:** Si al revisar el código frontend notas que necesitas consumir un endpoint y no tienes su contrato exacto (Request/Response), **DEBES DETENERTE Y PREGUNTARME**. Te proporcionaré el Swagger, las entradas y las salidas.
3. **NO REESCRIBIR DESDE CERO:** El frontend ya tiene código. Tu trabajo es identificar los componentes y servicios existentes que manejaban los reportes y *actualizarlos/corregirlos*.
4. **MANEJO DE DESCARGAS PDF:** Para los endpoints que retornan archivos PDF (`/pdf`), debes implementar correctamente la lógica en el frontend enviando el Token JWT en el Header de Autorización y manejando la respuesta como un `Blob` para forzar la descarga o abriéndolo en una nueva pestaña según sea más óptimo para la UX.

# Tareas Inmediatas a Desarrollar (Plan de Trabajo Inicial)
Debes analizar el código frontend actual y estructurar un plan en `PlanDeTrabajo.md` para abordar las siguientes integraciones que cambiaron en el backend:

1. **Eliminación de Código Obsoleto:**
   - Buscar y eliminar cualquier consumo al endpoint antiguo: `GET /api/items/{id}/analysis`.

2. **Integración de Formulario B-1 (Presupuesto General):**
   - Integrar JSON: `GET /api/Reports/projects/{projectId}/budget`.
   - Implementar vista/descarga PDF: `GET /api/Reports/projects/{projectId}/budget/pdf`.
   - *Nota UI:* Asegurarse de mostrar el nuevo campo `totalLiteral` en la interfaz.

3. **Integración de Formulario B-2 (Análisis de Precios Unitarios - APU):**
   - Integrar JSON (Datos Crudos): `GET /api/Reports/items/{itemId}/unit-price-analysis`.
   - Implementar vista/descarga PDF Individual: `GET /api/Reports/items/{itemId}/unit-price-analysis/pdf`.
   - Implementar vista/descarga PDF Masivo del Proyecto: `GET /api/Reports/projects/{projectId}/unit-price-analysis/pdf`.
   - *Nota UI:* Reflejar los nuevos cálculos donde el IVA = `(SubtotalMO + CargasSociales) * %LaborIVA`, y manejar visualmente cuando los impuestos IT/IVA vengan en `0.00`.

4. **Integración de Formulario B-3 (Precios Unitarios Elementales):**
   - Integrar JSON: `GET /api/Reports/projects/{projectId}/consolidated-resources` (Soporta query param `filter`: Materiales, Obreros, Equipos).
   - Implementar vista/descarga PDF: `GET /api/Reports/projects/{projectId}/consolidated-resources/pdf`.

# Instrucción de Inicio
Para comenzar:
1. Lee el archivo `instrucciones.md` en la ruta especificada.
2. Explora el código actual del frontend relacionado con la visualización de presupuestos, ítems y reportes.
3. Genera tu estrategia detallada paso a paso en el archivo `PlanDeTrabajo.md`.
4. Una vez guardado el plan, avísame para revisarlo y darte luz verde para empezar a modificar el código.