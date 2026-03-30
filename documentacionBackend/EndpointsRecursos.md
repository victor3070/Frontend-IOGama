Resources


GET
/api/Resources
Obtiene una lista paginada de insumos (recursos).

Parameters
Cancel
Name	Description
type
string
(query)
Opcional: Filtrar por tipo de recurso.
(Materiales, Obreros, Equipos)

--
pageNumber
integer($int32)
(query)
Número de página (default: 1).

1
pageSize
integer($int32)
(query)
Tamaño de página (default: 10).

10
onlyMyTenant
boolean
(query)
Si es true, excluye los insumos globales.


false




[
  {
    "id": "71a3843f-e751-4249-a5a1-e0f582ad2685",
    "name": "Adoquin doble S 20x10x8 cm",
    "unitName": "Metro cuadrado",
    "unitAbbreviation": "m2",
    "basePrice": 91,
    "code": "32470",
    "type": "Materiales",
    "isGlobal": true
  },
  {
    "id": "b35d6021-c7ca-4199-a80f-79cbaffd9962",
    "name": "Alambre de amarre NÂ°16",
    "unitName": "Kilogramo",
    "unitAbbreviation": "kg",
    "basePrice": 25,
    "code": "32468",
    "type": "Materiales",
    "isGlobal": true
  },
  {
    "id": "cde6a75f-5e44-4e85-b32a-7ab0a29dd066",
    "name": "alambre galvanizado N10",
    "unitName": "Bidón de 10kg",
    "unitAbbreviation": "bidón 10kg",
    "basePrice": 18,
    "code": "49152",
    "type": "Materiales",
    "isGlobal": true
  },
  {
    "id": "b8de07d1-9c4a-43ad-9bf1-b25de9e34b2c",
    "name": "Alquiler de tienda",
    "unitName": "Mes",
    "unitAbbreviation": "mes",
    "basePrice": 2500,
    "code": "44227",
    "type": "Materiales",
    "isGlobal": true
  },
  {
    "id": "106f0c8b-c496-4bfd-93e6-2863ad5ab7df",
    "name": "AlquitrÃ¡n",
    "unitName": "Kilogramo",
    "unitAbbreviation": "kg",
    "basePrice": 8.78,
    "code": "32475",
    "type": "Materiales",
    "isGlobal": true
  }
]

POST
/api/Resources
Crea un nuevo insumo (Material, Obrero o Equipo).

{
  "name": "string",
  "unitOfMeasureId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "basePrice": 0,
  "type": "Materiales",
  "code": "string"
}

GET
/api/Resources/search
Busca insumos por nombre o código de forma parcial.


Parameters
Cancel
Name	Description
searchTerm
string
(query)
Texto a buscar (Nombre o Código).

searchTerm
pageNumber
integer($int32)
(query)
Número de página.

1
pageSize
integer($int32)
(query)
Tamaño de página.

10


[
  {
    "id": "73dacf0d-a6d6-4e99-a2d2-c7a81e1fb87b",
    "name": "Cemento cola (con polÃ­meros)",
    "unitName": "Bolsa 20kg",
    "unitAbbreviation": "Bolsa 20kg",
    "basePrice": 110,
    "code": "32501",
    "type": "Materiales",
    "isGlobal": true
  },
  {
    "id": "8c364321-5c66-4177-95c7-f524775fbdda",
    "name": "Cemento cola para porcelanato",
    "unitName": "Bolsa 20kg",
    "unitAbbreviation": "Bolsa 20kg",
    "basePrice": 45,
    "code": "32510",
    "type": "Materiales",
    "isGlobal": true
  },
  {
    "id": "8f70800c-cd63-4d27-ac34-4840b5d93a97",
    "name": "Cemento portland IP-30 (kg)",
    "unitName": "Kilogramo",
    "unitAbbreviation": "kg",
    "basePrice": 1.55,
    "code": "32442",
    "type": "Materiales",
    "isGlobal": true
  }
]

PUT
/api/Resources/{id}

Actualiza un insumo existente.
Name	Description
id *
string($uuid)
(path)
ID del recurso.

id


{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "name": "string",
  "unitOfMeasureId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "basePrice": 0,
  "code": "string"
}

DELETE
/api/Resources/{id}
Elimina (Soft Delete) un insumo.

Name	Description
id *
string($uuid)
(path)
ID del recurso.

id
