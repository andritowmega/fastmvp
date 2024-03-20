
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