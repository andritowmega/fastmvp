# Guía Técnica Completa - Fast MVP

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
3. [Tecnologías](#tecnologías)
4. [Estructura de Directorios](#estructura-de-directorios)
5. [Configuración](#configuración)
6. [Rutas y Endpoints](#rutas-y-endpoints)
7. [Controladores](#controladores)
8. [Modelos](#modelos)
9. [Servicios](#servicios)
10. [Utilidades](#utilidades)
11. [Autenticación y Seguridad](#autenticación-y-seguridad)
12. [Base de Datos](#base-de-datos)
13. [Ejemplos de Uso](#ejemplos-de-uso)

---

## Introducción

**Fast MVP** es una biblioteca open source desarrollada en Node.js con Express.js que funciona como un ORM dinámico para PostgreSQL. Su objetivo es facilitar la creación rápida de MVPs (Minimum Viable Products) proporcionando endpoints genéricos para realizar operaciones CRUD, joins, autenticación y gestión de archivos sin necesidad de escribir código backend específico.

### Características Principales

- CRUD dinámico sobre cualquier tabla PostgreSQL
- Sistema de autenticación con JWT
- Gestión de permisos por tabla
- Joins entre tablas (INNER, LEFT, RIGHT)
- Exportación a Excel
- Integración con Cloudflare Images
- Servidor de archivos multimedia
- Interfaz web para visualización de datos

---

## Arquitectura del Proyecto

Fast MVP sigue el patrón **MVC (Model-View-Controller)** con una capa de servicios adicional:

```
┌──────────────┐
│   Cliente    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│    Rutas     │  (api.js, view.js)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Controladores│  (fastmvp.controller.js, viewer.controller.js)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Servicios   │  (allfunctions.service.js, viewer.service.js)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Modelos    │  (alltablescrud.model.js, joins.model.js)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  PostgreSQL  │
└──────────────┘
```

### Flujo de Datos

1. **Cliente** → Realiza petición HTTP
2. **Middleware de Autenticación** → Valida token y permisos
3. **Rutas** → Enrutan la petición al controlador correspondiente
4. **Controlador** → Procesa la petición y llama al servicio
5. **Servicio** → Aplica lógica de negocio y llama al modelo
6. **Modelo** → Construye y ejecuta queries SQL
7. **Base de Datos** → Retorna resultados
8. **Respuesta** → Se devuelve al cliente en formato JSON

---

## Tecnologías

### Backend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Node.js | - | Runtime de JavaScript |
| Express.js | ~4.16.1 | Framework web |
| PostgreSQL (pg) | ^8.11.3 | Cliente de base de datos |
| JWT (jsonwebtoken) | ^9.0.2 | Autenticación basada en tokens |
| bcryptjs | ^2.4.3 | Encriptación de contraseñas |

### Frontend

| Tecnología | Propósito |
|------------|-----------|
| Jade (Pug) | Motor de plantillas |

### Utilidades

| Librería | Propósito |
|----------|-----------|
| cors | Habilitar CORS |
| morgan | Logging de peticiones HTTP |
| express-fileupload | Gestión de archivos subidos |
| exceljs | Generación de archivos Excel |
| moment | Manipulación de fechas |
| node-fetch | Peticiones HTTP |
| form-data | Construcción de formularios multipart |

### Desarrollo y Testing

| Herramienta | Propósito |
|-------------|-----------|
| Jest | Framework de testing |
| Nodemon | Auto-recarga en desarrollo |
| mock-fs | Mock del sistema de archivos para tests |

---

## Estructura de Directorios

```
fastmvp/
├── bin/
│   └── www                          # Punto de entrada del servidor
├── config/
│   ├── configDb.json                # Configuración de proyectos y BD (no versionado)
│   └── postgresdb.js                # Conexión a PostgreSQL
├── fastmvpcore/
│   ├── controllers/
│   │   ├── fastmvp.controller.js    # Controlador principal API
│   │   ├── mediaserver.controller.js # Controlador de archivos multimedia
│   │   └── viewer.controller.js     # Controlador de vistas
│   ├── models/
│   │   ├── alltablescrud.model.js   # Modelo CRUD genérico
│   │   ├── joins.model.js           # Modelo de joins
│   │   └── infodatabase.model.js    # Modelo de metadata de BD
│   ├── routes/
│   │   ├── api.js                   # Rutas de la API
│   │   └── view.js                  # Rutas de vistas
│   ├── services/
│   │   ├── allfunctions.service.js  # Servicios principales
│   │   └── viewer.service.js        # Servicios de visualización
│   └── utils/
│       ├── auth.js                  # Utilidades de autenticación
│       ├── cloudflareimages.js      # Integración con Cloudflare
│       ├── excel.js                 # Generación de Excel
│       ├── functions.js             # Funciones auxiliares
│       └── toassemble.js            # Construcción de queries SQL
├── public/
│   ├── stylesheets/
│   ├── tmp/                         # Archivos temporales
│   └── assetsReadme/                # Recursos del README
├── routes/
│   └── index.js                     # Rutas principales
├── test/
│   └── utils/                       # Tests unitarios
├── views/
│   ├── fmvp/                        # Vistas del visualizador
│   ├── doc.jade
│   ├── error.jade
│   ├── index.jade
│   └── layout.jade
├── app.js                           # Configuración de Express
├── package.json
├── Dockerfile
└── readme.md
```

---

## Configuración

### Archivo `config/configDb.json`

Este archivo contiene la configuración de todos los proyectos. Cada proyecto tiene su propia conexión a BD y secreto para JWT:

```json
{
  "nombre_proyecto": {
    "type": "postgres",
    "connection": {
      "user": "usuario",
      "host": "localhost",
      "database": "nombre_bd",
      "password": "contraseña",
      "port": 5432
    },
    "token_secret": "clave_secreta_jwt",
    "cloudflareimages": {
      "domain": {
        "URI": "https://tudominio.com"
      },
      "accountId": "tu_account_id",
      "apiKey": "tu_api_key"
    },
    "files": {
      "mp3": {
        "free": "/ruta/a/archivos/mp3"
      }
    }
  }
}
```

**Campos importantes:**
- `type`: Tipo de base de datos (actualmente solo "postgres")
- `connection`: Credenciales de conexión PostgreSQL
- `token_secret`: Clave secreta para firmar tokens JWT
- `cloudflareimages` (opcional): Configuración para subir imágenes a Cloudflare
- `files` (opcional): Rutas a archivos multimedia

### Variables de entorno

El proyecto utiliza el archivo `bin/www` para iniciar el servidor:

```javascript
var port = normalizePort(process.env.PORT || '3000');
```

---

## Rutas y Endpoints

### Rutas Principales (`/`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Página de inicio |

### Rutas de API (`/fm/api`)

Todas las rutas de API están prefijadas con `/fm/api` y requieren especificar el proyecto en la URL: `/:project`.

#### Operaciones CRUD

| Método | Ruta | Autenticación | Descripción |
|--------|------|---------------|-------------|
| POST | `/:project/:table/get` | Condicional | Obtener datos de una tabla |
| POST | `/:project/:table/create` | Condicional | Crear registro en tabla |
| POST | `/:project/:table/update/:key/:value` | Condicional | Actualizar registro |
| POST | `/:project/:table/delete/:key/:value` | Condicional | Eliminar registro |

#### Joins

| Método | Ruta | Autenticación | Descripción |
|--------|------|---------------|-------------|
| POST | `/:project/:table1/innerj/:table2` | Condicional | INNER JOIN entre dos tablas |
| POST | `/:project/:table1/innerj/:table2/right` | Condicional | INNER JOIN filtrando por tabla2 |
| POST | `/:project/:table1/innerj/:table2/left` | Condicional | INNER JOIN filtrando por tabla1 |

#### Autenticación

| Método | Ruta | Autenticación | Descripción |
|--------|------|---------------|-------------|
| POST | `/:project/auth/:table/token/check` | No | Login - Genera token JWT |
| POST | `/:project/auth/token/info` | Sí | Valida token actual |
| POST | `/:project/auth/:table1/:table2/token/info` | Sí | Obtiene info del usuario autenticado |
| POST | `/:project/auth/:table/password` | Sí | Cambiar contraseña |

#### Funciones Especiales

| Método | Ruta | Autenticación | Descripción |
|--------|------|---------------|-------------|
| POST | `/:project/orderedlist` | Condicional | Ejecuta lista de operaciones en orden |
| POST | `/:project/:table/repetitivetask/update` | Condicional | Actualiza múltiples registros |

#### Cloudflare Images

| Método | Ruta | Autenticación | Descripción |
|--------|------|---------------|-------------|
| POST | `/:project/cloudflareimg/upload` | Sí | Subir imagen a Cloudflare |
| POST | `/:project/cloudflareimg/delete` | Sí | Eliminar imagen de Cloudflare |

#### Media Server

| Método | Ruta | Autenticación | Descripción |
|--------|------|---------------|-------------|
| GET | `/:project/files/mp3/free/:name` | No | Descargar archivo MP3 |

### Rutas de Visualización (`/fm/view`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/fm/view/` | Lista de proyectos |
| GET | `/fm/view/:project` | Lista de tablas del proyecto |
| GET | `/fm/view/:project/:table` | Visualiza datos de la tabla |

---

## Controladores

### `fastmvp.controller.js`

Controlador principal de la API. Todos los métodos son estáticos y siguen el patrón:

```javascript
static async MetodoControlador(req, res) {
  const { funcionServicio } = require("../services/allfunctions.service");
  const response = await funcionServicio(params).catch((e) => {
    console.error("Error:", e);
    return e;
  });
  return FastMvpController.toResponse(response, req, res);
}
```

#### Métodos Principales

| Método | Descripción | Parámetros |
|--------|-------------|------------|
| `Create` | Crea un registro | `project`, `table`, `body` |
| `Get` | Obtiene registros | `project`, `table`, `body`, `query.file` (opcional) |
| `Update` | Actualiza registro | `project`, `table`, `key`, `value`, `body` |
| `RepetitiveTaskUpdate` | Actualiza múltiples registros | `project`, `table`, `body.tasks[]` |
| `Delete` | Elimina registro | `project`, `table`, `key`, `value` |
| `InnerJoin` | JOIN entre tablas | `project`, `table1`, `table2`, `body` |
| `InnerJoinLeft` | JOIN filtrando izquierda | `project`, `table1`, `table2`, `body` |
| `InnerJoinRight` | JOIN filtrando derecha | `project`, `table1`, `table2`, `body` |
| `OrderedList` | Ejecuta lista ordenada de operaciones | `project`, `body.orderedList[]` |
| `CheckToken` | Login/autenticación | `project`, `table`, `body` |
| `InfoToken` | Validar token | `req.datatoken` |
| `GetInfo` | Info de usuario autenticado con JOIN | `project`, `table1`, `table2`, `body` |
| `UpdatePassword` | Cambiar contraseña | `project`, `table`, `body` |
| `UploadImageCF` | Subir imagen a Cloudflare | `project`, `files` |
| `DeleteImageCF` | Eliminar imagen de Cloudflare | `project`, `body.id` |

#### Método Especial: `toResponse`

Formatea las respuestas HTTP según el status:

```javascript
static toResponse(response, req, res) {
  if (response?.status && response.status == "ok") {
    functionsModule.deleteKey(response.data, "password");
    response.authentication = req.datatoken;
    return res.json(response).status(200);
  }
  // ... manejo de errores
}
```

### `viewer.controller.js`

Controlador para las vistas web:

| Método | Vista | Descripción |
|--------|-------|-------------|
| `Projects` | `fmvp/index` | Lista proyectos configurados |
| `SingleProject` | `fmvp/project/index` | Lista tablas del proyecto |
| `GetTableInfo` | `fmvp/project/table` | Muestra datos y metadata de tabla |

### `mediaserver.controller.js`

Controlador para servir archivos multimedia:

| Método | Descripción |
|--------|-------------|
| `Mp3Files` | Sirve archivos MP3 desde ruta configurada |

---

## Modelos

### `alltablescrud.model.js`

Modelo genérico para operaciones CRUD en cualquier tabla PostgreSQL.

#### `create(project, table, dataJson)`

Inserta un registro en la tabla especificada.

**Parámetros:**
- `project`: Nombre del proyecto en `configDb.json`
- `table`: Nombre de la tabla
- `dataJson`: Objeto con los datos a insertar

**Retorna:**
```javascript
{
  status: "ok",
  msg: "done",
  data: { /* registro insertado */ }
}
```

**Proceso:**
1. Establece conexión con BD del proyecto
2. Construye query INSERT con `makeSqlStringInsert`
3. Ejecuta query con valores parametrizados (previene SQL injection)
4. Retorna registro insertado con `RETURNING *`

#### `get(project, table, dataJson)`

Obtiene registros de una tabla.

**Parámetros:**
- `project`: Nombre del proyecto
- `table`: Nombre de la tabla
- `dataJson`: Objeto con filtros opcionales:
  - `filters`: Array de columnas a seleccionar
  - `where`: Condiciones de filtrado
  - `order`: Ordenamiento
  - `limit`: Límite de registros

**Retorna:**
```javascript
{
  status: "ok",
  msg: "done",
  data: [ /* array de registros */ ]
}
```

#### `update(project, table, dataJson, condition)`

Actualiza un registro.

**Parámetros:**
- `project`: Nombre del proyecto
- `table`: Nombre de la tabla
- `dataJson`: Objeto con campos a actualizar
- `condition`: Objeto con `key` y `value` para identificar registro

**Retorna:**
```javascript
{
  status: "ok",
  msg: "done",
  data: { /* registro actualizado */ }
}
```

#### `delete(project, table, condition)`

Elimina un registro.

**Parámetros:**
- `project`: Nombre del proyecto
- `table`: Nombre de la tabla
- `condition`: Objeto con `key` y `value` para identificar registro

**Retorna:**
```javascript
{
  status: "ok",
  msg: "done",
  data: { /* registro eliminado */ }
}
```

### `joins.model.js`

Modelo especializado en operaciones JOIN entre tablas.

#### `innerJoin(project, tables, dataJson)`

Ejecuta INNER JOIN entre dos tablas.

**Parámetros:**
- `project`: Nombre del proyecto
- `tables`: Objeto con `table1` y `table2`
- `dataJson`: Objeto con:
  - `keys`: Objeto con las columnas de JOIN (ej: `{"id_user": "id_user"}`)
  - `filters`: Columnas a seleccionar (opcional)
  - `where`: Condiciones WHERE (opcional)
  - `order`: Ordenamiento (opcional)

**Ejemplo:**
```javascript
{
  keys: { "id_profile": "id_profile" },
  filters: ["email", "name", "phone"],
  where: {
    type: "iqual",
    conditional: { "status": "true" }
  }
}
```

**Query generada:**
```sql
SELECT email, name, phone
FROM login
INNER JOIN profile ON login.id_profile = profile.id_profile
WHERE status='true'
```

#### `innerJoinValueLeft(project, tables, dataJson)`

INNER JOIN filtrando por valor en tabla izquierda.

**Parámetros adicionales:**
- `dataJson.value`: Valor a filtrar en la tabla izquierda

#### `innerJoinValueRight(project, tables, dataJson)`

INNER JOIN filtrando por valor en tabla derecha.

**Parámetros adicionales:**
- `dataJson.value`: Valor a filtrar en la tabla derecha

### `infodatabase.model.js`

Modelo para obtener metadata de la base de datos.

#### `getTables(project)`

Obtiene lista de tablas del esquema público.

**Query:**
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
```

#### `getMetaDataTable(project, table)`

Obtiene metadata de columnas de una tabla.

**Query:**
```sql
SELECT column_name, data_type, is_nullable, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'nombre_tabla'
```

**Retorna:**
```javascript
{
  status: "ok",
  msg: "done",
  data: [
    {
      column_name: "id",
      data_type: "integer",
      is_nullable: "NO",
      character_maximum_length: null
    },
    // ...
  ]
}
```

---

## Servicios

### `allfunctions.service.js`

Capa de servicios que aplica lógica de negocio sobre los modelos.

#### `create(project, table, dataJson)`

Servicio de creación con manejo de errores mejorado.

**Proceso:**
1. Llama a `AllTablesModel.create`
2. Si hay error, interpreta código SQL con `errorControlWithSqlCode`
3. Retorna mensaje amigable al usuario

#### `get(project, table, data)`

Servicio de obtención de datos.

#### `update(project, table, dataJson, condition)`

Servicio de actualización.

#### `deletePg(project, table, condition)`

Servicio de eliminación.

#### `innerJoin(project, tables, dataJson)`

Servicio de INNER JOIN.

#### `innerJoinLeft(project, tables, dataJson)`

Servicio de INNER JOIN con filtro izquierdo.

#### `innerJoinRight(project, tables, dataJson)`

Servicio de INNER JOIN con filtro derecho.

#### `orderedList(project, data)`

Ejecuta una lista de operaciones en orden secuencial.

**Formato del body:**
```json
{
  "orderedList": [
    {
      "type": "create",
      "in": "profile",
      "body": {
        "name": "Juan",
        "phone": "123456789"
      }
    },
    {
      "type": "create",
      "in": "login",
      "body": {
        "email": "juan@email.com",
        "password": "contraseña123",
        "id_profile": "USE::profile.id_profile"
      }
    }
  ]
}
```

**Nota:** `USE::` permite usar valores de respuestas anteriores.

**Tipos soportados:**
- `create`: Insertar registro
- `get`: Obtener datos
- `delete`: Eliminar registro

#### `loginToken(project, table, body)`

Servicio de autenticación.

**Proceso:**
1. Busca usuario por email (realiza JOIN con `profile`)
2. Compara contraseña hasheada con `bcrypt`
3. Genera token JWT con `newTokenUser`
4. Retorna token con expiración configurable

**Body esperado:**
```json
{
  "where": {
    "conditional": {
      "email": "usuario@email.com"
    }
  },
  "password": "contraseña",
  "lifetimedays": "7"
}
```

**Respuesta exitosa:**
```json
{
  "status": "ok",
  "msg": "Bienvenido de nuevo",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### `uploadImageCF(project, files)`

Sube imagen a Cloudflare Images.

**Proceso:**
1. Valida configuración de Cloudflare en proyecto
2. Guarda archivo temporalmente en `/public/tmp/`
3. Sube a Cloudflare mediante API
4. Elimina archivo temporal
5. Retorna metadata de imagen

#### `deleteImageCF(project, data)`

Elimina imagen de Cloudflare Images.

**Body:**
```json
{
  "id": "id_imagen_cloudflare"
}
```

---

## Utilidades

### `auth.js`

Módulo de autenticación y autorización.

#### `newTokenUser(data, expiration, project)`

Genera un nuevo token JWT.

**Parámetros:**
- `data`: Datos del usuario (se elimina `password` automáticamente)
- `expiration`: Días de validez (ej: "7")
- `project`: Proyecto para obtener `token_secret`

**Retorna:** String del token JWT

#### `comparePassword(password, passwordhash)`

Compara contraseña en texto plano con hash bcrypt.

**Retorna:** Promise<boolean>

#### `authenticateUser(req, res, next)`

Middleware de autenticación.

**Proceso:**
1. Consulta tabla `accesstoken` del proyecto
2. Verifica si la tabla solicitada requiere autenticación
3. Si requiere autenticación:
   - Extrae token de `body.dtfmvp`, `query.dtfmvp`, `headers.authorization` o `cookies.dtfmvp`
   - Valida token con `checktoken`
   - Adjunta datos decodificados a `req.datatoken`
4. Si no requiere autenticación, continúa sin validar

**Formato de token en header:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### `replaceWithUserData(req, res, next)`

Middleware que reemplaza valores `AUTH::` en el body con datos del token.

**Ejemplo:**
```json
// Body original
{
  "id_user": "AUTH::id"
}

// Si req.datatoken = { id: 123, email: "user@email.com" }
// Body transformado
{
  "id_user": 123
}
```

#### `checktoken(tokenBrowser, project)`

Valida un token JWT.

**Retorna:** Promise con datos decodificados o null si es inválido

### `functions.js`

Utilidades generales del proyecto.

#### `sanitationStringSql(data)`

Sanitiza strings para prevenir SQL injection.

**Proceso:**
1. Normaliza caracteres NFD
2. Elimina acentos
3. Elimina comillas y punto y coma
4. Hace trim

**Ejemplo:**
```javascript
sanitationStringSql("'; DROP TABLE users--")
// Retorna: " DROP TABLE users--"
```

#### `errorControlWithSqlCode(errJson, table)`

Interpreta códigos de error PostgreSQL y retorna mensajes amigables.

**Códigos manejados:**
- `42P01`: Tabla no existe
- `22P02`: Tipo de dato inválido
- `23505`: Violación de unique constraint (duplicado)
- `23502`: Campo NOT NULL sin valor
- `42703`: Columna no existe
- `outrange`: Valor fuera de rango (custom)
- `wrongproject`: Proyecto no existe (custom)

#### `replaceUSE(obj, responseArray)`

Reemplaza valores `USE::` en objetos con valores de respuestas previas.

**Uso en `orderedList`:**
```javascript
// Respuesta anterior en responseArray[0]:
{
  "profile": {
    "status": "ok",
    "data": { "id_profile": 42 }
  }
}

// Objeto con USE::
{
  "id_profile": "USE::profile.id_profile"
}

// Resultado:
{
  "id_profile": 42
}
```

#### `isNoEmptyJSON(obj)`

Verifica si un objeto JSON no está vacío.

#### `generateResponse(response, req, res)`

Genera respuesta HTTP estandarizada.

**Proceso:**
1. Elimina campo `password` de la respuesta
2. Adjunta `authentication` con datos del token
3. Determina código HTTP según status y código de error

#### `deleteKey(object, keySearch)`

Elimina recursivamente una clave de un objeto/array.

#### `replaceKeyValue(jsonObj, searchValue, newJsonObj)`

Reemplaza valores que comienzan con un prefijo.

**Ejemplo:**
```javascript
replaceKeyValue(
  { "user_id": "AUTH::id" },
  "AUTH::",
  { id: 123 }
)
// Resultado: { "user_id": 123 }
```

#### `generateRandomString(length)`

Genera string aleatorio alfanumérico.

### `toassemble.js`

Módulo para construcción de queries SQL dinámicas.

#### `makeSqlStringInsert(dataJson)`

Construye la parte VALUES de un INSERT.

**Proceso:**
1. Si contiene `password`, la hashea con bcrypt
2. Construye lista de columnas y placeholders parametrizados
3. Añade `RETURNING *`

**Entrada:**
```javascript
{ name: "Juan", email: "juan@email.com", password: "123456" }
```

**Salida:**
```sql
(name, email, password) VALUES ($1, $2, $3) RETURNING *
```

#### `makeSqlStringUpdate(dataJson, condition)`

Construye SET para UPDATE.

**Soporta operadores especiales:**
- `PLUS::valor`: Incrementa campo (`field = field + valor`)
- `MINUS::valor`: Decrementa campo (`field = field - valor`)

**Entrada:**
```javascript
dataJson = { credits: "PLUS::10", name: "Juan" }
condition = { key: "id", value: "123" }
```

**Salida:**
```sql
credits=credits + $1, name=$2 WHERE id = '123' RETURNING *
```

#### `makeSqlStringDelete(condition)`

Construye WHERE para DELETE.

**Salida:**
```sql
WHERE id = '123' RETURNING *
```

#### `makeSqlStringSelect(dataJson)`

Construye SELECT dinámico.

**Soporta funciones de agregación:**
- `SUM::campo` → `SUM(campo)`
- `COUNT::campo` → `COUNT(campo)`
- `AVG::campo` → `AVG(campo)`

**Entrada:**
```javascript
{
  functions: ["SUM::amount", "COUNT::id"]
}
```

**Salida:**
```sql
SUM(amount), COUNT(id)
```

**Con filters:**
```javascript
{ filters: ["name", "email"] }
```

**Salida:**
```sql
name, email
```

#### `makeSqlStringSelectWhere(dataJson)`

Construye cláusula WHERE dinámica.

**Tipos de condiciones:**
- `iqual`: Igualdad (`=`)
- `like`: Búsqueda con patrón (`LIKE '%valor%'`)
- `ilike`: Búsqueda case-insensitive (`ILIKE '%valor%'`)
- `smallerthan`: Menor que (`<`)
- `greaterthan`: Mayor que (`>`)
- `between`: Entre dos valores (`BETWEEN x AND y`)
- `different`: Diferente (`<>`)

**Valores especiales:**
- `CURRENT_DATE`: Fecha actual
- `CURRENT_TIMESTAMP`: Timestamp actual
- `ROW::campo`: Referencia a otra columna

**Ejemplo 1 - Igualdad:**
```javascript
{
  where: {
    type: "iqual",
    conditional: { "status": "active" }
  }
}
```
**SQL:** `WHERE status='active'`

**Ejemplo 2 - LIKE:**
```javascript
{
  where: {
    type: "like",
    conditional: { "name": "Juan" }
  }
}
```
**SQL:** `WHERE name LIKE '%Juan%'`

**Ejemplo 3 - BETWEEN:**
```javascript
{
  where: {
    type: "between",
    row: "created_at",
    range: {
      first: "2024-01-01",
      second: "2024-12-31"
    }
  }
}
```
**SQL:** `WHERE created_at BETWEEN '2024-01-01' AND '2024-12-31'`

**Ejemplo 4 - Múltiples condiciones:**
```javascript
{
  where: {
    conditionals: [
      {
        type: "iqual",
        conditional: { "status": "active" }
      },
      "AND",
      {
        type: "greaterthan",
        conditional: { "age": "18" }
      }
    ]
  }
}
```
**SQL:** `WHERE status='active' AND age > '18'`

**Ejemplo 5 - Con intervalo temporal:**
```javascript
{
  where: {
    type: "smallerthan",
    conditional: { "expires_at": "CURRENT_TIMESTAMP" },
    interval: {
      type: "-",
      value: "7 days"
    }
  }
}
```
**SQL:** `WHERE expires_at<CURRENT_TIMESTAMP - INTERVAL '7 days'`

#### `makeSqlStringSelectOrder(dataJson)`

Construye ORDER BY.

**Entrada:**
```javascript
{
  order: {
    "created_at": "DESC"
  }
}
```

**Salida:**
```sql
ORDER BY created_at DESC
```

#### `makeSqlStringSelectLimit(dataJson)`

Construye LIMIT.

**Entrada:**
```javascript
{ limit: 10 }
```

**Salida:**
```sql
limit 10
```

### `excel.js`

Clase para generar archivos Excel.

#### Constructor

```javascript
const Excel = require("./excel");
const excel = new Excel();
```

#### `create(data)`

Genera un archivo Excel desde datos.

**Parámetros:**
```javascript
{
  excel: {
    sheet: {
      name: "Nombre de la hoja",
      properties: {}
    }
  },
  data: [
    { id: 1, name: "Juan", email: "juan@email.com" },
    { id: 2, name: "María", email: "maria@email.com" }
  ]
}
```

**Proceso:**
1. Crea workbook
2. Añade hoja con nombre especificado
3. Detecta headers automáticamente desde el primer objeto
4. Añade filas de datos
5. Ajusta ancho de columnas automáticamente
6. Retorna buffer del archivo Excel

**Retorna:** Promise<Buffer>

**Uso en controlador:**
```javascript
const buffer = await excel.create(data);
res.setHeader("Content-Disposition", `attachment; filename=reporte.xlsx`);
res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
res.send(buffer);
```

### `cloudflareimages.js`

Integración con Cloudflare Images API.

#### `upload({ file }, project)`

Sube una imagen a Cloudflare.

**Parámetros:**
- `file`: Objeto file de express-fileupload
- `project`: Nombre del proyecto para obtener credenciales

**Proceso:**
1. Valida configuración de Cloudflare en proyecto
2. Genera nombre aleatorio para el archivo
3. Guarda archivo en `/public/tmp/`
4. Crea FormData con URL del archivo
5. POST a API de Cloudflare: `https://api.cloudflare.com/client/v4/accounts/{accountId}/images/v1`
6. Elimina archivo temporal
7. Retorna objeto con metadata de imagen

**Retorna:**
```javascript
{
  id: "id_unico_imagen",
  filename: "nombre_archivo",
  uploaded: "2024-01-01T12:00:00.000Z",
  requireSignedURLs: false,
  variants: [
    "https://imagedelivery.net/account_hash/id_imagen/public"
  ]
}
```

#### `delete(idimage, project)`

Elimina una imagen de Cloudflare.

**Parámetros:**
- `idimage`: ID de la imagen en Cloudflare
- `project`: Nombre del proyecto

**Proceso:**
1. DELETE a API: `https://api.cloudflare.com/client/v4/accounts/{accountId}/images/v1/{idimage}`
2. Retorna resultado

**Retorna:**
```javascript
{
  status: "ok",
  msg: "Imagen eliminada",
  data: null
}
```

---

## Autenticación y Seguridad

### Sistema de Tokens JWT

Fast MVP utiliza JSON Web Tokens para autenticación stateless.

#### Flujo de Autenticación

1. **Login:**
   - Cliente envía email y password a `POST /:project/auth/login/token/check`
   - Servidor busca usuario en BD
   - Compara password con hash bcrypt
   - Genera token JWT firmado con `token_secret` del proyecto
   - Retorna token al cliente

2. **Peticiones autenticadas:**
   - Cliente incluye token en header, body, query o cookie
   - Middleware `authenticateUser` extrae y valida token
   - Datos decodificados se almacenan en `req.datatoken`
   - Middleware `replaceWithUserData` reemplaza valores `AUTH::`

3. **Expiración:**
   - Tokens expiran según `lifetimedays` especificado en login
   - Formato: `{ expiresIn: '7d' }`

### Tabla `accesstoken`

Controla qué tablas requieren autenticación.

**Estructura:**
```sql
CREATE TABLE accesstoken (
  id_access SERIAL PRIMARY KEY,
  tablename VARCHAR NOT NULL,
  access BOOLEAN DEFAULT FALSE
);
```

**Ejemplos:**
```sql
-- Tabla pública (no requiere token)
INSERT INTO accesstoken (tablename, access) VALUES ('products', false);

-- Tabla privada (requiere token)
INSERT INTO accesstoken (tablename, access) VALUES ('users', true);
INSERT INTO accesstoken (tablename, access) VALUES ('orders', true);
```

**Funcionamiento:**
- Si `access = false`: Endpoint es público
- Si `access = true`: Endpoint requiere token válido
- Si tabla no está en `accesstoken`: Se considera pública

### Seguridad en Queries SQL

Fast MVP implementa múltiples capas de seguridad:

1. **Queries Parametrizadas:**
```javascript
connection.query(
  "INSERT INTO users (name, email) VALUES ($1, $2)",
  [name, email]
);
```

2. **Sanitización de Strings:**
```javascript
sanitationStringSql(userInput)
// Elimina: ', ", ;
```

3. **Validación de Nombres de Tablas:**
```javascript
if(!connection) {
  return reject({
    status: "error",
    msg: "wrong project",
    error: {code: "wrongproject"}
  });
}
```

4. **Hash de Contraseñas:**
```javascript
// Al crear/actualizar
dataJson.password = bcrypt.hashSync(dataJson.password, 8);

// Al comparar
bcrypt.compare(plainPassword, hashedPassword);
```

### Uso de `AUTH::` para Contexto de Usuario

Permite referenciar datos del usuario autenticado en las peticiones:

**Ejemplo - Crear orden para usuario autenticado:**
```json
POST /:project/orders/create
{
  "id_user": "AUTH::id",
  "product_id": 42,
  "quantity": 2
}
```

Si `req.datatoken = { id: 123, email: "user@email.com" }`, se crea:
```json
{
  "id_user": 123,
  "product_id": 42,
  "quantity": 2
}
```

---

## Base de Datos

### Requisitos

- PostgreSQL 8.x o superior
- Esquema `public` (usado por defecto)

### Estructura de Tablas para Módulo de Autenticación

Para usar las funciones de login/registro, se necesitan estas tablas:

#### Tabla `profile`

```sql
CREATE TABLE profile (
  id_profile SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  address TEXT
  -- Puedes agregar más campos según necesites
);
```

#### Tabla `login`

```sql
CREATE TABLE login (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  id_profile INTEGER REFERENCES profile(id_profile),
  status BOOLEAN DEFAULT TRUE,
  role SMALLINT DEFAULT 2
);
```

**Roles sugeridos:**
- `1`: Administrador
- `2`: Usuario normal
- `3`: Usuario limitado

#### Tabla `accesstoken`

```sql
CREATE TABLE accesstoken (
  id_access SERIAL PRIMARY KEY,
  tablename VARCHAR(255) NOT NULL,
  access BOOLEAN DEFAULT FALSE
);
```

### Conexión a Base de Datos

**Archivo:** `config/postgresdb.js`

```javascript
const { Pool } = require("pg");
const optionsConnetion = require("./configDb.json");

module.exports = (project) => {
  if (!optionsConnetion[project]) {
    console.error("Project not found in configDb.json");
    return null;
  }

  const pool = new Pool(optionsConnetion[project].connection);
  return pool;
};
```

**Características:**
- Pool de conexiones para mejor rendimiento
- Una conexión por proyecto
- Auto-cierre de conexiones con `connection.end()`

---

## Ejemplos de Uso

### 1. Obtener Todos los Productos

**Request:**
```http
POST /fm/api/miproyecto/products/get
Content-Type: application/json

{}
```

**Response:**
```json
{
  "status": "ok",
  "msg": "Datos obtenidos",
  "data": [
    {
      "id": 1,
      "name": "Laptop HP",
      "price": 899.99,
      "stock": 15
    },
    {
      "id": 2,
      "name": "Mouse Logitech",
      "price": 25.50,
      "stock": 100
    }
  ],
  "authentication": null
}
```

### 2. Obtener Productos con Filtros

**Request:**
```http
POST /fm/api/miproyecto/products/get
Content-Type: application/json

{
  "filters": ["name", "price"],
  "where": {
    "type": "greaterthan",
    "conditional": {
      "price": "50"
    }
  },
  "order": {
    "price": "DESC"
  },
  "limit": 5
}
```

**Response:**
```json
{
  "status": "ok",
  "msg": "Datos obtenidos",
  "data": [
    {
      "name": "Laptop HP",
      "price": 899.99
    }
  ]
}
```

### 3. Crear Producto

**Request:**
```http
POST /fm/api/miproyecto/products/create
Content-Type: application/json

{
  "name": "Teclado Mecánico",
  "price": 75.00,
  "stock": 30,
  "category_id": 2
}
```

**Response:**
```json
{
  "status": "ok",
  "msg": "Se insertó correctamente",
  "data": {
    "id": 3,
    "name": "Teclado Mecánico",
    "price": 75.00,
    "stock": 30,
    "category_id": 2
  }
}
```

### 4. Actualizar Producto

**Request:**
```http
POST /fm/api/miproyecto/products/update/id/3
Content-Type: application/json

{
  "price": 69.99,
  "stock": "MINUS::5"
}
```

**Nota:** `MINUS::5` resta 5 unidades al stock actual.

**Response:**
```json
{
  "status": "ok",
  "msg": "Se actualizo correctamente",
  "data": {
    "id": 3,
    "name": "Teclado Mecánico",
    "price": 69.99,
    "stock": 25,
    "category_id": 2
  }
}
```

### 5. Eliminar Producto

**Request:**
```http
POST /fm/api/miproyecto/products/delete/id/3
```

**Response:**
```json
{
  "status": "ok",
  "msg": "Se elimino correctamente",
  "data": {
    "id": 3,
    "name": "Teclado Mecánico",
    "price": 69.99
  }
}
```

### 6. INNER JOIN

**Request:**
```http
POST /fm/api/miproyecto/orders/innerj/users
Content-Type: application/json

{
  "keys": {
    "id_user": "id"
  },
  "filters": ["order_id", "total", "name", "email"],
  "where": {
    "type": "iqual",
    "conditional": {
      "status": "completed"
    }
  }
}
```

**Response:**
```json
{
  "status": "ok",
  "msg": "Datos obtenidos",
  "data": [
    {
      "order_id": 1,
      "total": 150.00,
      "name": "Juan Pérez",
      "email": "juan@email.com"
    }
  ]
}
```

### 7. Registro de Usuario (OrderedList)

**Request:**
```http
POST /fm/api/miproyecto/orderedlist
Content-Type: application/json

{
  "orderedList": [
    {
      "type": "create",
      "in": "profile",
      "body": {
        "name": "María González",
        "phone": "555-1234",
        "address": "Calle Principal 123"
      }
    },
    {
      "type": "create",
      "in": "login",
      "body": {
        "email": "maria@email.com",
        "password": "segura123",
        "id_profile": "USE::profile.id_profile",
        "role": 2
      }
    }
  ]
}
```

**Response:**
```json
{
  "status": "ok",
  "msg": "Consultas ordenadas",
  "data": [
    {
      "profile": {
        "status": "ok",
        "msg": "Se insertó correctamente",
        "data": {
          "id_profile": 42,
          "name": "María González",
          "phone": "555-1234",
          "address": "Calle Principal 123"
        }
      }
    },
    {
      "login": {
        "status": "ok",
        "msg": "Se insertó correctamente",
        "data": {
          "id": 15,
          "email": "maria@email.com",
          "id_profile": 42,
          "status": true,
          "role": 2
        }
      }
    }
  ]
}
```

### 8. Login

**Request:**
```http
POST /fm/api/miproyecto/auth/login/token/check
Content-Type: application/json

{
  "where": {
    "conditional": {
      "email": "maria@email.com"
    }
  },
  "password": "segura123",
  "lifetimedays": "7",
  "keys": {
    "id_profile": "id_profile"
  }
}
```

**Response:**
```json
{
  "status": "ok",
  "msg": "Bienvenido de nuevo",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsImVtYWlsIjoibWFyaWFAZW1haWwuY29tIiwiaWRfcHJvZmlsZSI6NDIsInN0YXR1cyI6dHJ1ZSwicm9sZSI6MiwibmFtZSI6Ik1hcsOtYSBHb256w6FsZXoiLCJwaG9uZSI6IjU1NS0xMjM0IiwiaWF0IjoxNzA1MDAwMDAwLCJleHAiOjE3MDU2MDQ4MDB9.signature"
  }
}
```

### 9. Petición Autenticada con Token

**Request:**
```http
POST /fm/api/miproyecto/orders/create
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "id_user": "AUTH::id",
  "total": 250.00,
  "status": "pending"
}
```

**Response:**
```json
{
  "status": "ok",
  "msg": "Se insertó correctamente",
  "data": {
    "order_id": 10,
    "id_user": 15,
    "total": 250.00,
    "status": "pending",
    "created_at": "2024-01-01T12:00:00.000Z"
  },
  "authentication": {
    "id": 15,
    "email": "maria@email.com",
    "id_profile": 42,
    "role": 2,
    "name": "María González"
  }
}
```

### 10. Obtener Información del Usuario Autenticado

**Request:**
```http
POST /fm/api/miproyecto/auth/login/profile/token/info
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "keys": {
    "id_profile": "id_profile"
  },
  "where": {
    "conditional": {
      "key": "id"
    }
  }
}
```

**Response:**
```json
{
  "status": "ok",
  "msg": "Datos obtenidos",
  "data": [
    {
      "id": 15,
      "email": "maria@email.com",
      "id_profile": 42,
      "status": true,
      "role": 2,
      "name": "María González",
      "phone": "555-1234",
      "address": "Calle Principal 123"
    }
  ],
  "authentication": {
    "id": 15,
    "email": "maria@email.com",
    "id_profile": 42,
    "role": 2
  }
}
```

### 11. Cambiar Contraseña

**Request:**
```http
POST /fm/api/miproyecto/auth/login/password
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "where": {
    "conditional": {
      "key": "id"
    }
  },
  "password": "segura123",
  "newpassword": "nuevaSegura456"
}
```

**Response:**
```json
{
  "status": "ok",
  "msg": "Se actualizo correctamente",
  "data": {
    "id": 15,
    "email": "maria@email.com"
  }
}
```

### 12. Actualización Repetitiva

**Request:**
```http
POST /fm/api/miproyecto/products/repetitivetask/update
Content-Type: application/json

{
  "tasks": [
    {
      "key": "id",
      "value": "1",
      "body": {
        "stock": "PLUS::10"
      }
    },
    {
      "key": "id",
      "value": "2",
      "body": {
        "stock": "PLUS::20"
      }
    },
    {
      "key": "id",
      "value": "3",
      "body": {
        "price": "MINUS::5"
      }
    }
  ]
}
```

**Response:**
```json
{
  "status": "ok",
  "msg": "Tareas Repetitivas",
  "data": [
    {
      "status": "ok",
      "msg": "Se actualizo correctamente",
      "data": { "id": 1, "stock": 25 }
    },
    {
      "status": "ok",
      "msg": "Se actualizo correctamente",
      "data": { "id": 2, "stock": 120 }
    },
    {
      "status": "ok",
      "msg": "Se actualizo correctamente",
      "data": { "id": 3, "price": 70.00 }
    }
  ]
}
```

### 13. Exportar a Excel

**Request:**
```http
POST /fm/api/miproyecto/products/get?file=excel
Content-Type: application/json

{
  "where": {
    "type": "greaterthan",
    "conditional": {
      "stock": "0"
    }
  }
}
```

**Response:**
```
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename=Reporte_products_2024-01-01.xlsx

[Archivo Excel binario]
```

### 14. Subir Imagen a Cloudflare

**Request:**
```http
POST /fm/api/miproyecto/cloudflareimg/upload
Content-Type: multipart/form-data
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

file: [archivo de imagen]
```

**Response:**
```json
{
  "status": "ok",
  "msg": "Imagen subida correctamente",
  "data": {
    "id": "abc123def456",
    "filename": "randomname123.jpg",
    "uploaded": "2024-01-01T12:00:00.000Z",
    "requireSignedURLs": false,
    "variants": [
      "https://imagedelivery.net/hash/abc123def456/public"
    ]
  }
}
```

### 15. Búsqueda con LIKE

**Request:**
```http
POST /fm/api/miproyecto/users/get
Content-Type: application/json

{
  "filters": ["name", "email"],
  "where": {
    "type": "ilike",
    "conditional": {
      "name": "mar"
    }
  }
}
```

**Response:**
```json
{
  "status": "ok",
  "msg": "Datos obtenidos",
  "data": [
    {
      "name": "María González",
      "email": "maria@email.com"
    },
    {
      "name": "Mario Rodríguez",
      "email": "mario@email.com"
    }
  ]
}
```

### 16. Consulta con Funciones de Agregación

**Request:**
```http
POST /fm/api/miproyecto/orders/get
Content-Type: application/json

{
  "functions": ["COUNT::id", "SUM::total", "AVG::total"]
}
```

**Response:**
```json
{
  "status": "ok",
  "msg": "Datos obtenidos",
  "data": [
    {
      "count": 150,
      "sum": 45000.00,
      "avg": 300.00
    }
  ]
}
```

### 17. Consulta con BETWEEN

**Request:**
```http
POST /fm/api/miproyecto/orders/get
Content-Type: application/json

{
  "where": {
    "type": "between",
    "row": "created_at",
    "range": {
      "first": "2024-01-01",
      "second": "2024-01-31"
    }
  }
}
```

### 18. Descargar Archivo MP3

**Request:**
```http
GET /fm/api/miproyecto/files/mp3/free/cancion.mp3
```

**Response:**
```
Content-Type: audio/mpeg

[Archivo MP3 binario]
```

---

## Consideraciones de Producción

### Seguridad

1. **Nunca versionar `config/configDb.json`:**
   ```bash
   echo "config/configDb.json" >> .gitignore
   ```

2. **Usar HTTPS en producción**

3. **Configurar CORS apropiadamente:**
   ```javascript
   app.use(cors({
     origin: 'https://tudominio.com',
     credentials: true
   }));
   ```

4. **Usar variables de entorno para secretos:**
   ```javascript
   token_secret: process.env.JWT_SECRET
   ```

5. **Limitar rate de peticiones** (instalar express-rate-limit)

### Performance

1. **Usar índices en BD:**
   ```sql
   CREATE INDEX idx_email ON login(email);
   CREATE INDEX idx_status ON orders(status);
   ```

2. **Configurar pool de conexiones:**
   ```javascript
   const pool = new Pool({
     ...connection,
     max: 20,
     idleTimeoutMillis: 30000,
     connectionTimeoutMillis: 2000
   });
   ```

3. **Implementar caché (Redis)**

### Logs

Configurar morgan para producción:
```javascript
app.use(logger('combined')); // en vez de 'dev'
```

### Docker

El proyecto incluye Dockerfile:

```bash
docker build -t fastmvp .
docker run -d --name fastmvp -p 3005:3000 fastmvp
```

---

## Testing

### Ejecutar Tests

```bash
npm test
```

### Estructura de Tests

```
test/
├── utils/
│   ├── auth.test.js
│   ├── functions.test.js
│   └── toassemble.test.js
```

### Ejemplo de Test con Jest

```javascript
const { sanitationStringSql } = require("../../fastmvpcore/utils/functions");

describe("sanitationStringSql", () => {
  test("debe eliminar comillas simples", () => {
    expect(sanitationStringSql("'; DROP TABLE--")).toBe(" DROP TABLE--");
  });

  test("debe eliminar acentos", () => {
    expect(sanitationStringSql("José María")).toBe("Jose Maria");
  });
});
```

---

## Contribución

Para contribuir al proyecto:

1. Fork del repositorio
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -am 'Añade nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

---

## Licencia

Este proyecto es open source. Consulta el archivo LICENSE para más detalles.

---

## Soporte

Para reportar bugs o solicitar features:
- GitHub Issues: https://github.com/andritowmega/fastmvp/issues

---

## Changelog

### Versión 0.0.0 (Actual)

- Implementación inicial
- CRUD dinámico
- Sistema de autenticación JWT
- Joins entre tablas
- Exportación a Excel
- Integración Cloudflare Images
- Servidor de archivos multimedia
- Interfaz web de visualización

---

**Desarrollado por:** 2 Semi Seniors y medio
- Andres Carrasco Quispe
- Diego Alonso Zanabria Sacsi
- Luis Alberto Ccalluchi Lopez
