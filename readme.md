
# Fast MVP

It is a project that I started in express javascript. Given the large number of entrepreneurship projects for startups to develop. This project is dedicated to entrepreneurial programmers, it does not focus on quality and correct architecture, we will bet everything on speed in developing mvp's to validate ideas.
# Why use it
* You need to develop a quick mvp
* Install it in less than a minute
* Focus on the FrontEnd
* Validate your Idea

# Until when to use it?
* If your startup starts generating income then change this by developing your robust custom backend


## Installation

Install my-project with npm

```bash
  cd my-project
  npm install my-project
```
    
## Config Database

create the configDev.json file inside the config folder. This file is in gitignore

``` 
config/configDev.json

{  
    user: "postgres",
    host: "localhost",
    database: "yourdb",
    password: "yourpassword",
    port: 5432
}
```





# REST API

All fastMVP api works on http://localhost:3000/fm/api/

## Simple CRUD

### Select 


`POST /fm/api/:table/get`

Makes the select query from any table.

#### Select all
do not send anything in the body to obtain a query of type SELECT * FROM TABLE;
#### Response
    {
        "status": "ok",
        "msg": "Datos obtenidos",
        "data": [
            {
                "id": 31,
                "name": "Carlos2 Torres",
                "phone": "929545871",
                "email": "carlos2@hotmail.com",
                "status": false,
                "city": null
            },
            {
                "id": 32,
                "name": "Carlos3 Torres",
                "phone": "929545873",
                "email": "carlos3@hotmail.com",
                "status": false,
                "city": null
            },
            {
                "id": 35,
                "name": "Carlos5 Torres",
                "phone": "929545875",
                "email": "carlos5@hotmail.com",
                "status": false,
                "city": null
            }
        ]
    }

#### Select with filters
add filters to the select query by sending filters in the body to obtain the following result:
Example: SELECT filter1,filter2,filter3 FROM table;

``` 
body payload

{  
    filters: ["name","phone"],
}
```
#### Response

    {
        "status": "ok",
        "msg": "Datos obtenidos",
        "data": [
            {
                "name": "Carlos2 Torres",
                "phone": "929545871"
            },
            {
                "name": "Carlos3 Torres",
                "phone": "929545873"
            },
            {
                "name": "Carlos5 Torres",
                "phone": "929545875"
            }
        ]
    }

### Insert 

`POST /fm/api/:table/create`

insert data into any table agregando en el body.

``` 
body payload

{  
    "name":"Carlos6 Torres",
    "phone":"929545876",
    "email":"carlos6@hotmail.com",
    "status":true
}
```
#### Response

    {
        "status": "ok",
        "msg": "Se insertó correctamente",
        "data": {
            "id": 36,
            "name": "Carlos6 Torres",
            "phone": "929545876",
            "email": "carlos6@hotmail.com",
            "status": true,
            "city": null
        }
    }

### Delete

`POST /fm/api/:table/delete/:key/:value`

Removes data from any table by adding the where conditional to :key/:value.

For example: /fm/api/user/delete/id/15

create the statement DELETE FROM user WHERE id = 15 RETURNING *;

#### Response

    {
        "status": "ok",
        "msg": "Se elimino correctamente",
        "data": {
            "id": 20,
            "name": "Andres Carrasco",
            "phone": "929960761",
            "email": "andres1@hotmail.com",
            "status": true,
            "city": null
        }
    }

### Update

`POST /fm/api/:table/update/:key/:value`

Update data from any table by adding the where conditional to :key/:value.

For example: /fm/api/user/update/id/27

``` 
body payload

{
    "phone":"929960763",
    "email":"algo@hotmail.com"
}
```

create the statement UPDATE user SET phone=$1, email=$2 WHERE id = 15 RETURNING *;

#### Response

    {
        "status": "ok",
        "msg": "Se actualizo correctamente",
        "data": {
            "id": 27,
            "name": "Andres Carrasco",
            "phone": "929960763",
            "email": "algo@hotmail.com",
            "status": true,
            "city": null
        }
    }

### InnerJoin

It is important to keep in mind the position of the tables for SQL queries, table1 will be on the left and table2 will be on the right for the next queries that require where, left join and right join

`EXAMPLE POST /fm/api/:table1/innerj/:table2`

    SELECT * FROM table1 INNER JOIN tabla2 ON table1.column = table2.column;

`EXAMPLE POST /fm/api/user/innerj/history`

    SELECT * FROM user INNER JOIN history ON user.column = history.column;

#### InnerJoin without where

`POST /fm/api/:table1/innerj/:table2`

``` 
body payload

"keys":{
        "leftKey":"rightKey"
    }
```
    SELECT * FROM table1 INNER JOIN tabla2 ON table1.leftKey = table2.rightKey;

#### EXAMPLE InnerJoin without where

`POST /fm/api/tst/innerj/test2` 

``` 
body payload

"keys":{
        "id":"id_user"
    }
```
    SELECT * FROM tst INNER JOIN test2 ON tst.id = test2.id_user;
``` 
Response

{
    "status": "ok",
    "msg": "Datos obtenidos",
    "data": [
        {
            "id": 1,
            "name": "Carlos2 Torres",
            "phone": "929545871",
            "email": "carlos2@hotmail.com",
            "status": false,
            "city": null,
            "origen": "La Campiña",
            "destino": "El centro",
            "id_pasajero": 32,
            "id_user": 31,
            "precio": "25.1"
        },
        {
            "id": 2,
            "name": "Carlos2 Torres",
            "phone": "929545871",
            "email": "carlos2@hotmail.com",
            "status": false,
            "city": null,
            "origen": "Plaza de Armas",
            "destino": "Feria el altiplano",
            "id_pasajero": 35,
            "id_user": 31,
            "precio": "30"
        },
        {
            "id": 3,
            "name": "Carlos6 Torres",
            "phone": "929545876",
            "email": "carlos6@hotmail.com",
            "status": true,
            "city": null,
            "origen": "Estadio melgar",
            "destino": "Aeropuerto",
            "id_pasajero": 27,
            "id_user": 36,
            "precio": "58.5"
        },
        {
            "id": 4,
            "name": "Carlos6 Torres",
            "phone": "929545876",
            "email": "carlos6@hotmail.com",
            "status": true,
            "city": null,
            "origen": "Estadio melgar",
            "destino": "Aeropuerto",
            "id_pasajero": 27,
            "id_user": 36,
            "precio": "58.5"
        }
    ]
}
```

You can also add filters for the select query

`POST /fm/api/tst/innerj/test2` 

``` 
body payload

{
    "filters":["tst.id AS idtst","precio"],
    "keys":{
        "id":"id_user"
    }
}
```
    SELECT tst.id AS idtst,precio FROM tst INNER JOIN test2 ON tst.id = test2.id_user;
``` 
Response

{
    "status": "ok",
    "msg": "Datos obtenidos",
    "data": [
        {
            "idtst": 31,
            "precio": "25.1"
        },
        {
            "idtst": 31,
            "precio": "30"
        },
        {
            "idtst": 36,
            "precio": "58.5"
        },
        {
            "idtst": 36,
            "precio": "58.5"
        }
    ]
}
```

#### InnerJoin with where

To use where, you need to maintain the order of left table and right table in the body payload.

When adding RIGHT at the end, you want to search for the right table, in this example it is table2

`POST /fm/api/:table1/innerj/:table2/right`

``` 
body payload

{
    "value":123,
    "keys":{
        "leftKey":"rightKey"
    }
}

```
    SELECT * FROM table1 INNER JOIN tabla2 ON table1.leftKey = table2.rightKey WHERE table2.rightkey = 123;

When adding LEFT at the end, you want to search for the left table, in this example it is table1

`POST /fm/api/:table1/innerj/:table2/left`

``` 
body payload

{
    "value":123,
    "keys":{
        "leftKey":"rightKey"
    }
}
```
    SELECT * FROM table1 INNER JOIN tabla2 ON table1.leftKey = table2.rightKey WHERE table1.leftkey = 123;

You can also add filters for the select query and the answers are the same as the previous ones.

``` 
body payload

{
    "filters":["tst.id AS idtst","*"],
    "value":123,
    "keys":{
        "id":"id_user"
    }
}
```
    SELECT tst.id AS idtst,* FROM table1 INNER JOIN tabla2 ON table1.leftKey = table2.rightKey WHERE table1.leftkey = 123;