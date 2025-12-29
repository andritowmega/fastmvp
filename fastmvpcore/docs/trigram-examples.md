# Ejemplos de Uso de Trigrams en FastMVP

Esta funcionalidad permite realizar búsquedas de texto similares utilizando los operadores trigram de PostgreSQL. **Automáticamente incluye el valor de similarity en el SELECT con el alias "similarity"**.

## Tipos de Trigrams Soportados

1. **similarity %** - Devuelve porcentaje de similaridad (0.0 - 1.0)
2. **word_similarity %>** - Similaridad basada en palabras completas
3. **strict_word_similarity %>>** - Similaridad estricta de palabras
4. **distance <->** - Distancia trigram (menor = más similar)
5. **word_distance <<->** - Distancia basada en palabras

## Ejemplos de Uso

### 1. Búsqueda por Similarity

```javascript
// POST /api/{project}/{table}
{
  "where": {
    "type": "trigram",
    "trigram": "similarity",
    "conditional": {
      "name": "Juan"
    }
  },
  "limit": 10
}
```

**SQL generado:**
```sql
SELECT *, similarity('Juan', name) AS similarity FROM tabla WHERE name % 'Juan' LIMIT 10
```

### 2. Búsqueda por Word Similarity

```javascript
// POST /api/{project}/{table}
{
  "where": {
    "type": "trigram",
    "trigram": "word_similarity",
    "conditional": {
      "description": "producto electronico"
    }
  },
  "limit": 20
}
```

**SQL generado:**
```sql
SELECT *, word_similarity('producto electronico', description) AS similarity FROM tabla WHERE description %> 'producto electronico' LIMIT 20
```

### 3. Búsqueda por Strict Word Similarity

```javascript
// POST /api/{project}/{table}
{
  "where": {
    "type": "trigram",
    "trigram": "strict_word_similarity",
    "conditional": {
      "title": "consulta medica"
    }
  },
  "limit": 15
}
```

**SQL generado:**
```sql
SELECT *, strict_word_similarity('consulta medica', title) AS similarity FROM tabla WHERE title %>> 'consulta medica' LIMIT 15
```

### 4. Búsqueda por Distance (ordenado por distancia)

```javascript
// POST /api/{project}/{table}
{
  "where": {
    "type": "trigram",
    "trigram": "distance",
    "conditional": {
      "content": "texto a buscar"
    }
  },
  "order": {
    "content": "ASC"  // Ordenar por distancia
  },
  "limit": 10
}
```

**SQL generado:**
```sql
SELECT *, distance('texto a buscar', content) AS similarity FROM tabla WHERE content <-> 'texto a buscar' ORDER BY content ASC LIMIT 10
```

### 5. Búsqueda por Word Distance

```javascript
// POST /api/{project}/{table}
{
  "where": {
    "type": "trigram",
    "trigram": "word_distance",
    "conditional": {
      "description": "busqueda avanzada"
    }
  },
  "order": {
    "description": "ASC"
  },
  "limit": 25
}
```

**SQL generado:**
```sql
SELECT *, word_distance('busqueda avanzada', description) AS similarity FROM tabla WHERE description <<-> 'busqueda avanzada' ORDER BY description ASC LIMIT 25
```

## Ejemplo con Condicional de Usuario

```javascript
// POST /api/{project}/{table}
{
  "where": {
    "type": "trigram",
    "trigram": "strict_word_similarity",
    "conditional": {
      "id_user": "AUTH::id_profile"
    }
  },
  "limit": 50
}
```

**SQL generado:**
```sql
SELECT *, strict_word_similarity('AUTH::id_profile', id_user) AS similarity FROM tabla WHERE id_user %>> 'AUTH::id_profile' LIMIT 50
```

## Consideraciones Importantes

1. **Extensión pg_trgm**: Para usar trigrams, la extensión `pg_trgm` debe estar instalada en PostgreSQL:
   ```sql
   CREATE EXTENSION IF NOT EXISTS pg_trgm;
   ```

2. **Índices**: Para mejor rendimiento, se recomienda crear índices gin en las columnas que usen trigrams:
   ```sql
   CREATE INDEX idx_columna_trgm ON tabla USING gin(columna gin_trgm_ops);
   ```

3. **Sensibilidad a Mayúsculas**: Los trigrams son case-insensitive por defecto.

4. **Retorno Automático**: **La función automáticamente incluye el valor de similarity en el SELECT con el alias "similarity"**.

5. **Combinación con Otros Filtros**: Los trigrams se pueden combinar con otros tipos de filtros usando `conditionals` array.

## Ejemplo de Combinación con Filtros

```javascript
// POST /api/{project}/{table}
{
  "where": {
    "conditionals": [
      {
        "type": "iqual",
        "conditional": {
          "status": "active"
        }
      },
      "AND",
      {
        "type": "trigram",
        "trigram": "similarity",
        "conditional": {
          "name": "producto"
        }
      }
    ]
  },
  "limit": 20
}
```

**SQL generado:**
```sql
SELECT *, similarity('producto', name) AS similarity FROM tabla WHERE status = 'active' AND name % 'producto' LIMIT 20
```

## Ejemplo con Filtros Específicos

```javascript
// POST /api/{project}/{table}
{
  "filters": ["id", "name", "email"],
  "where": {
    "type": "trigram",
    "trigram": "strict_word_similarity",
    "conditional": {
      "id_user": "AUTH::id_profile"
    }
  },
  "limit": 50
}
```

**SQL generado:**
```sql
SELECT id, name, email, strict_word_similarity('AUTH::id_profile', id_user) AS similarity FROM tabla WHERE id_user %>> 'AUTH::id_profile' LIMIT 50
```

## Beneficios de esta Implementación

- **Automático**: No necesitas especificar manualmente las funciones de similarity
- **Consistente**: Siempre retorna el valor con el alias "similarity"
- **Flexible**: Funciona con todos los tipos de trigram y filtros existentes
- **Optimizado**: Se integra perfectamente con el sistema de filtros existente