
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
    filters: ["name","lastname"],
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