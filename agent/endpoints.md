BudgetItems


GET
/api/modules/{moduleId}/items
Obtiene todos los ítems de presupuesto (APUs) de un módulo.

Entrada:
Name	Description
moduleId *
string($uuid)
(path)
ID del módulo padre.

a1b158a8-58ee-4b89-b7c3-42ea9d13ff93

Salida:


Code	Details
200	
Response body
Download
[
  {
    "id": "4ef9ac91-062f-461c-8ea3-0e81d0aa5a94",
    "name": "Excavación manual para cimientos",
    "unit": "m3",
    "quantity": 1,
    "unitPrice": 1342.36,
    "code": "EXC-01",
    "projectModuleId": "a1b158a8-58ee-4b89-b7c3-42ea9d13ff93",
    "total": 1342.36,
    "materialCost": 1.79,
    "laborCost": 147,
    "equipmentCost": 350
  },
  {
    "id": "2e20655a-89c6-4326-a23e-62eba906eb3d",
    "name": "mi test",
    "unit": "año",
    "quantity": 0,
    "unitPrice": 2744.26,
    "code": null,
    "projectModuleId": "a1b158a8-58ee-4b89-b7c3-42ea9d13ff93",
    "total": 0,
    "materialCost": 1100,
    "laborCost": 0,
    "equipmentCost": 0
  }
]

POST
/api/modules/{moduleId}/items
Crea un nuevo ítem de presupuesto vacío en un módulo.

Entrada: 
moduleId *
string($uuid)
(path)
ID del módulo padre.

a1b158a8-58ee-4b89-b7c3-42ea9d13ff93

{
  "moduleId": "a1b158a8-58ee-4b89-b7c3-42ea9d13ff93",
  "name": "mi test",
  "unitOfMeasureId": "a082bf62-0b46-4ea4-ac60-b4369fe3f081",
  "quantity": 0
}

Salida:

200	
Response body
Download
"2e20655a-89c6-4326-a23e-62eba906eb3d"

POST
/api/items/{id}/resources/import
Importa insumos desde el catálogo maestro al ítem de obra.

Name	Description
id *
string($uuid)
(path)
ID del ítem de presupuesto.

id


{
  "budgetItemId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "resources": [
    {
      "resourceId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "performance": 0
    }
  ]
}

POST
/api/modules/{moduleId}/items/import
Importa (clona) una lista de ítems desde el Catálogo Maestro al Proyecto.

Entrada:

Name	Description
moduleId *
string($uuid)
(path)
ID del módulo destino.

{
  "moduleId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "items": [
    {
      "templateId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "quantity": 0
    }
  ]
}

PUT
/api/items/{id}
Actualiza la cabecera de un ítem de presupuesto (Nombre, Cantidad, Código, Unidad).

Name	Description
id *
string($uuid)
(path)
ID del ítem.

id

{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "name": "string",
  "unitOfMeasureId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "quantity": 0,
  "code": "string"
}

DELETE
/api/items/{id}
Elimina (Soft Delete) un ítem de presupuesto completo y sus recursos.

Name	Description
id *
string($uuid)
(path)
ID del ítem.

id


POST
/api/items/{id}/resources/custom
Agrega un recurso personalizado (manual) a un ítem de presupuesto.
Entrada:
Name	Description
id *
string($uuid)
(path)
ID del ítem de presupuesto.

2e20655a-89c6-4326-a23e-62eba906eb3d

{
  "budgetItemId": "2e20655a-89c6-4326-a23e-62eba906eb3d",
  "name": "string",
  "unitOfMeasureId": "ee8aebd8-ab13-4363-b556-c3730ea3b0c0",
  "unitPrice": 110,
  "performance": 10,
  "quantity": 0,
  "type": "Materiales"
}

Salida:


Code	Details
200	
Response body
Download
"8133b6be-a737-4c00-b03f-2014b779ab93"


PUT
/api/items/{id}/resources/{resourceId}
Actualiza un recurso específico dentro de un ítem de obra.

Name	Description
id *
string($uuid)
(path)
ID del ítem de obra.

id
resourceId *
string($uuid)
(path)
ID del recurso a editar.

resourceId


DELETE
/api/items/{id}/resources/{resourceId}
Elimina un recurso específico de un ítem de presupuesto.

Name	Description
id *
string($uuid)
(path)
ID del ítem padre (solo para ruta).

id
resourceId *
string($uuid)
(path)
ID del recurso a eliminar.

resourceId


