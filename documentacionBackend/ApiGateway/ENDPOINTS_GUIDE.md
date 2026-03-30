
swagger

Reports


GET
/api/Reports/projects/{projectId}/budget
Genera el Formulario B-1: Presupuesto por Ítems y General de la obra.

Entrada:

Name	Description
projectId *
string($uuid)
(path)
ID del proyecto.

f87615de-a3f8-4290-b4bf-76aa76b845e5

Salida:

{
  "projectId": "f87615de-a3f8-4290-b4bf-76aa76b845e5",
  "projectName": "Construcción de Vivienda Unifamiliar – Zona Norte",
  "projectCode": "IOG-OBR-001",
  "client": "Carlos Mendoza",
  "location": "Tarija, Provincia Cercado, Barrio Los Pinos",
  "totalAmount": 31802.32,
  "totalLiteral": "Treinta y Un Mil Ochocientos Dos 32/100 Bolivianos",
  "modules": [
    {
      "id": "fb0b7e90-60ff-4026-8e37-ed4bbbac3384",
      "name": "Obras Preliminares",
      "totalAmount": 5001.24,
      "order": 0,
      "items": [
        {
          "id": "3a1bd907-4706-4808-969e-e44b2296c0b5",
          "itemNumber": "1.1",
          "name": "Excavación manual para cimientos",
          "unit": "m3",
          "quantity": 1,
          "unitPrice": 1532.02,
          "unitPriceLiteral": "Mil Quinientos Treinta y Dos 02/100",
          "totalPrice": 1532.02
        },
        {
          "id": "30cfc4d6-91e7-41dd-ad5e-f29ed396d846",
          "itemNumber": "1.2",
          "name": "Pared de ladrillos",
          "unit": "m",
          "quantity": 1,
          "unitPrice": 3469.22,
          "unitPriceLiteral": "Tres Mil Cuatrocientos Sesenta y Nueve 22/100",
          "totalPrice": 3469.22
        }
      ]
    },
    {
      "id": "b8c3e035-88e0-4444-a89f-0280b0cc8a0a",
      "name": "Movimiento de Tierras",
      "totalAmount": 5411.71,
      "order": 1,
      "items": [
        {
          "id": "164249f9-61d0-45dc-bec0-0a03d7f5b23c",
          "itemNumber": "2.1",
          "name": "Excavación manual para cimientos",
          "unit": "m3",
          "quantity": 1,
          "unitPrice": 1532.02,
          "unitPriceLiteral": "Mil Quinientos Treinta y Dos 02/100",
          "totalPrice": 1532.02
        },
        {
          "id": "11b552f6-a95f-4f3f-adc2-1ccd8eedc5d2",
          "itemNumber": "2.2",
          "name": "eee",
          "unit": "bolsa",
          "quantity": 1,
          "unitPrice": 3879.69,
          "unitPriceLiteral": "Tres Mil Ochocientos Setenta y Nueve 69/100",
          "totalPrice": 3879.69
        }
      ]
    },
    {
      "id": "1b181da2-38ba-4c31-b9d8-8d06318ac221",
      "name": "Cimentaciones",
      "totalAmount": 7020.23,
      "order": 2,
      "items": [
        {
          "id": "bcd83059-b296-47a0-bf4e-e0257cf2e10c",
          "itemNumber": "3.1",
          "name": "eee",
          "unit": "bolsa",
          "quantity": 1,
          "unitPrice": 3879.69,
          "unitPriceLiteral": "Tres Mil Ochocientos Setenta y Nueve 69/100",
          "totalPrice": 3879.69
        },
        {
          "id": "b2bbfcf7-5976-4699-8483-a4b4579ca96c",
          "itemNumber": "3.2",
          "name": "string",
          "unit": "año",
          "quantity": 1,
          "unitPrice": 3140.54,
          "unitPriceLiteral": "Tres Mil Ciento Cuarenta 54/100",
          "totalPrice": 3140.54
        }
      ]
    },
    {
      "id": "c0d74595-be35-49c5-bcd7-b984d1b1b0f4",
      "name": "Obra Gruesa",
      "totalAmount": 10489.45,
      "order": 3,
      "items": [
        {
          "id": "80b23d76-96d7-4d04-9f82-b2f1e54b79cc",
          "itemNumber": "4.1",
          "name": "string",
          "unit": "año",
          "quantity": 1,
          "unitPrice": 3140.54,
          "unitPriceLiteral": "Tres Mil Ciento Cuarenta 54/100",
          "totalPrice": 3140.54
        },
        {
          "id": "2370334e-cd89-4bc4-bf39-0e72f5ddd013",
          "itemNumber": "4.2",
          "name": "Pared de ladrillos",
          "unit": "m",
          "quantity": 1,
          "unitPrice": 3469.22,
          "unitPriceLiteral": "Tres Mil Cuatrocientos Sesenta y Nueve 22/100",
          "totalPrice": 3469.22
        },
        {
          "id": "9da78186-2b7c-418a-ba48-067327aa73f2",
          "itemNumber": "4.3",
          "name": "eee",
          "unit": "bolsa",
          "quantity": 1,
          "unitPrice": 3879.69,
          "unitPriceLiteral": "Tres Mil Ochocientos Setenta y Nueve 69/100",
          "totalPrice": 3879.69
        }
      ]
    },
    {
      "id": "2b1e7ded-7d01-49ce-a456-5c20e31f51b5",
      "name": "Instalaciones",
      "totalAmount": 3879.69,
      "order": 4,
      "items": [
        {
          "id": "7c873051-9480-4f8e-89ff-f8440da187fd",
          "itemNumber": "5.1",
          "name": "eee",
          "unit": "bolsa",
          "quantity": 1,
          "unitPrice": 3879.69,
          "unitPriceLiteral": "Tres Mil Ochocientos Setenta y Nueve 69/100",
          "totalPrice": 3879.69
        }
      ]
    }
  ]
}



GET
/api/Reports/projects/{projectId}/budget/pdf
Exporta el Formulario B-1 a formato PDF.

Entrada:

Name	Description
projectId *
string($uuid)
(path)
ID del proyecto.

f87615de-a3f8-4290-b4bf-76aa76b845e5


Salida:


Code	Details
200	
Response body
Download file
Response headers
 content-disposition: attachment; filename=Formulario_B1_Construcci_n_de_Vivienda_Unifamiliar___Zona_Norte.pdf; filename*=UTF-8''Formulario_B1_Construcci%C3%B3n_de_Vivienda_Unifamiliar_%E2%80%93_Zona_Norte.pdf 
 content-length: 57289 
 content-type: application/pdf 
 date: Wed,18 Mar 2026 21:30:36 GMT 
 server: Kestrel 


GET
/api/Reports/projects/{projectId}/consolidated-resources
Genera el Formulario B-3: Precios Unitarios Elementales.

Entrada:

Name	Description
projectId *
string($uuid)
(path)
ID del proyecto.

f87615de-a3f8-4290-b4bf-76aa76b845e5
filter
string
(query)
Opcional: Filtrar por tipo de recurso (Materiales, Obreros, Equipos).


Salida marcada con el recurso Materiales:


Code	Details
200	
Response body
Download
{
  "projectId": "f87615de-a3f8-4290-b4bf-76aa76b845e5",
  "projectName": "Construcción de Vivienda Unifamiliar – Zona Norte",
  "projectCode": "IOG-OBR-001",
  "client": "Carlos Mendoza",
  "location": "Tarija, Provincia Cercado, Barrio Los Pinos",
  "categoryFilter": "Materiales",
  "materials": [
    {
      "index": 1,
      "name": "Cal (kg)",
      "unit": "kg",
      "unitPrice": 1.79
    },
    {
      "index": 2,
      "name": "cemenUpdate",
      "unit": "año",
      "unitPrice": 10
    },
    {
      "index": 3,
      "name": "Fibra de Carbono",
      "unit": "bolsa 3.5 Kg",
      "unitPrice": 111
    },
    {
      "index": 4,
      "name": "Fibra de Carbono1",
      "unit": "Bs",
      "unitPrice": 1120
    }
  ],
  "labor": [],
  "equipment": []
}


GET
/api/Reports/projects/{projectId}/consolidated-resources/pdf
Exporta el Formulario B-3 a formato PDF.

Entrada:

Name	Description
projectId *
string($uuid)
(path)
ID del proyecto.

f87615de-a3f8-4290-b4bf-76aa76b845e5
filter
string
(query)
Opcional: Filtrar por tipo de recurso (Materiales, Obreros, Equipos).


Materiales

Salida:

	
Response body
Download file
Response headers
 content-disposition: attachment; filename=Formulario_B3_Construcci_n_de_Vivienda_Unifamiliar___Zona_Norte.pdf; filename*=UTF-8''Formulario_B3_Construcci%C3%B3n_de_Vivienda_Unifamiliar_%E2%80%93_Zona_Norte.pdf 
 content-length: 47871 
 content-type: application/pdf 
 date: Wed,18 Mar 2026 21:33:15 GMT 
 server: Kestrel 

GET
/api/Reports/items/{itemId}/unit-price-analysis
Genera el Formulario B-2: Análisis de Precios Unitarios (JSON).

Name	Description
itemId *
string($uuid)
(path)
ID del ítem de presupuesto.

itemId

{
  "budgetItemId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "itemName": "string",
  "itemUnit": "string",
  "itemQuantity": 0,
  "projectName": "string",
  "projectCode": "string",
  "client": "string",
  "location": "string",
  "totalMaterials": 0,
  "materials": [
    {
      "name": "string",
      "unit": "string",
      "performance": 0,
      "unitPrice": 0,
      "total": 0
    }
  ],
  "laborSubtotal": 0,
  "socialBenefitsPercentage": 0,
  "socialBenefits": 0,
  "laborIVAPercentage": 0,
  "laborIVA": 0,
  "totalLabor": 0,
  "labor": [
    {
      "name": "string",
      "unit": "string",
      "performance": 0,
      "unitPrice": 0,
      "total": 0
    }
  ],
  "equipmentSubtotal": 0,
  "minorToolsPercentage": 0,
  "minorTools": 0,
  "totalEquipment": 0,
  "equipment": [
    {
      "name": "string",
      "unit": "string",
      "performance": 0,
      "unitPrice": 0,
      "total": 0
    }
  ],
  "generalExpensesPercentage": 0,
  "generalExpenses": 0,
  "utilityPercentage": 0,
  "utility": 0,
  "itPercentage": 0,
  "taxIT": 0,
  "finalUnitPrice": 0,
  "finalUnitPriceLiteral": "string"
}

GET
/api/Reports/items/{itemId}/unit-price-analysis/pdf
Exporta el Formulario B-2 a formato PDF (Un solo ítem).

Name	Description
itemId *
string($uuid)
(path)
ID del ítem.

itemId


GET
/api/Reports/projects/{projectId}/unit-price-analysis/pdf
Exporta todos los Formularios B-2 de un proyecto a un solo archivo PDF.

Name	Description
projectId *
string($uuid)
(path)
ID del proyecto.

projectId


