# ✅ Fast MVP  

## 👇 Índice  

1. [Equipo](#equipo)  
2. [Propósito del Proyecto](#propósito-del-proyecto)  
   - [Objetivo](#objetivo)  
   - [Arquitectura de Software](#arquitectura-de-software)  
   - [Funcionalidades principales](#funcionalidades-principales)  
3. [Tecnologías](#tecnologías)  
   - [Lenguajes de Programación](#lenguajes-de-programación)  
   - [Frameworks](#frameworks)  
   - [Bibliotecas](#bibliotecas)  
   - [Herramientas de Construcción y Pruebas](#herramientas-de-construcción-y-pruebas)  
4. [Jenkins pipeline](#Jenkins)  
5. [Pruebas unitarias con Jest](#pruebas-unitarias-con-jest)
6. [Postman Pruebas funcionales](#postman-pruebas-funcionales)
7. [Escaneo con ZAP](#Escaneo-con-ZAP)
8. [Configuración Inicial](#configuracion-inicial)
9. [FastMVP View](#fastmvp-view)
10. [FastMVP Api](#fastmvp-api)

## 🧑‍💻 Equipo  

**Nombre del equipo:** 2 Semi Seniors y medio  

**Integrantes:**  
- Andres Carrasco Quispe   
- Diego Alonso Zanabria Sacsi
- Luis Alberto Ccalluchi Lopez


## 🎸 Propósito del Proyecto  

### Objetivo  

**Fast MVP** es un proyecto desarrollado en **JavaScript** que funciona sobre **Express.js**. Su objetivo es facilitar la creación de MVPs (Minimum Viable Products) para emprendimientos y startups que necesitan construir prototipos funcionales de manera rápida y económica.  

Este proyecto ofrece un backend funcional que actúa como un **ORM**, permitiendo que puedas interactuar con él desde el frontend de tu aplicación mediante llamadas API y el envío de parámetros en formato JSON para realizar consultas.  

Es importante destacar que **Fast MVP** no busca reemplazar un backend completo. Su propósito es servir como una herramienta ágil para la construcción de MVPs y la validación de ideas de negocio en sus etapas iniciales.  

### 👷 Arquitectura de Software  

**Fast MVP** utiliza una arquitectura basada en **Frontend-Backend** diseñada para facilitar la creación de prototipos funcionales (MVPs) de manera ágil y económica. La estructura del proyecto incluye las siguientes capas:  

1. **Backend (Express.js con Arquitectura MVC):**  
   - Desarrollado en **JavaScript**, el backend está construido sobre **Express.js**, empleando el patrón **Modelo-Vista-Controlador (MVC)** para una organización clara y eficiente del código.  
   - Ofrece un backend funcional que actúa como un **ORM**, permitiendo realizar consultas mediante API REST y gestionar la lógica de negocio, autenticación, y operaciones de datos.  

2. **Frontend:**  
   - Diseñado para interactuar con el backend a través de llamadas API y enviar parámetros en formato JSON.  
   - Flexible en su integración con tecnologías como React, Angular, o cualquier framework que permita desarrollar interfaces dinámicas y modernas.  

**Nota:** Fast MVP está pensado como una herramienta ágil para validar ideas de negocio en sus primeras etapas y no pretende reemplazar un backend completo.  

### Funcionalidades principales  


## 🛠️ Tecnologías  

### Lenguajes de Programación  
- JavaScript  

### Frameworks  
- Express.js (Backend)  
- Jade (Frontend)  

### Bibliotecas  
- React Router  
- Tailwind CSS  
- Material UI y Material UI Icons  

### Herramientas de Construcción y Pruebas  
- npm (gestión de dependencias para Express)  
- jest (pruebas unitarias y pruebas funcionales)


## 🗿 CI/CD Pipeline

 ```groovy
pipeline {
    agent any
    environment {
        REPO_DIR = '/home/proyects/dock-fastmvp' // Ruta completa a tu proyecto
    }
    stages {
        stage('Prepare Repository') {
            steps {
                script {
                    // Verificar si el directorio existe, y si no, crearlo
                    sh """
                        if [ ! -d "${REPO_DIR}" ]; then
                            echo "Directorio no encontrado, creando ${REPO_DIR}..."
                            mkdir -p ${REPO_DIR}
                        fi
                    """
                    
                    // Si el repositorio ya existe, hacer un git pull, sino clonar el repositorio
                    if (fileExists("${REPO_DIR}/.git")) {
                        echo "Repositorio ya existe, haciendo git pull..."
                        dir(REPO_DIR) {
                            sh 'git pull origin main'
                        }
                    } else {
                        echo "Repositorio no encontrado, clonando..."
                        dir(REPO_DIR) {
                            // Usar las credenciales de GitHub para clonar el repositorio
                            git credentialsId: 'github_credentials', branch: 'main', url: 'https://github.com/andritowmega/fastmvp.git'
                        }
                    }
                }
            }
        }
        stage('Create configDb.json if not exists') {
            steps {
                script {
                    // Verificar si el archivo configDb.json no existe
                    sh """
                        if [ ! -f "${REPO_DIR}/config/configDb.json" ]; then
                            echo "Archivo configDb.json no encontrado, creando..."
                            mkdir -p ${REPO_DIR}/config
                            echo '{
                              "citygo": {
                                "type": "postgres",
                                "connection": {
                                  "user": "citygo",
                                  "host": "161.132.50.80",
                                  "database": "citygo",
                                  "password": "Citygo",
                                  "port": 5432
                                },
                                "token_secret":"TokenCityo2024"
                              },
                              "disronaldo": {
                                "type": "postgres",
                                "connection": {
                                  "user": "fronaldo",
                                  "host": "161.150.31.58",
                                  "database": "fronaldo",
                                  "password": "Fronaldo4",
                                  "port": 5432
                                },
                                "token_secret":"Ronaldo2021"
                              },
                              "fronaldo":{
                                "type":"postgres",
                                "connection":{
                                  "user":"andres_ronaldo",
                                  "host":"191.101.16.158",
                                  "database":"andres_ronaldo",
                                  "password":"Ronaldo%",
                                  "port": 5432
                                },
                                "token_secret":"RonaldoDista2024%"
                              },

                            }' > ${REPO_DIR}/config/configDb.json
                        else
                            echo "El archivo configDb.json ya existe, no es necesario crear."
                        fi
                    """
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                dir(REPO_DIR) {
                    // Detener y eliminar el contenedor antes de reconstruir la imagen
                    script {
                        sh 'docker stop fastmvp || true'
                        
                        // Espera a que el contenedor se detenga antes de eliminarlo
                        sh '''
                        if docker ps -a | grep -q fastmvp; then
                            docker rm fastmvp
                        fi
                        '''
                        // Reconstruir la imagen de Docker
                        sh 'docker build -t fastmvp .'
                    }
                }
            }
        }
        
        stage('Run Docker Container') {
            steps {
                script {
                    def status = sh(script: 'docker run -d --name fastmvp -p 3005:3000 -v /home/mp3/data:/app/data --restart on-failure:15 fastmvp', returnStatus: true)
                    if (status != 0) {
                        error "Docker container failed to start!"
                    }
                }
            }
        }
        stage('Clean Up') {
            steps {
                sh 'docker image prune -f'
            }
        }
    }
}
```


### Jenkins
- La implementación de entrega continua con jenkins fue configurado con docker, en las siguientes imagenes se pueden ver como funcionan los stages:

![](https://raw.githubusercontent.com/andritowmega/fastmvp/019b2672fd44301bc880458617d656f8d817ebff/public/assetsReadme/jenkins-stages-builds.PNG)

![](https://raw.githubusercontent.com/andritowmega/fastmvp/019b2672fd44301bc880458617d656f8d817ebff/public/assetsReadme/jenkins-deploys.PNG)

### Pruebas Unitarias con Jest

Jest es un framework de pruebas para aplicaciones de JavaScript desarrollado por Facebook. Es ampliamente utilizado para escribir, organizar y ejecutar pruebas unitarias, de integración y funcionales, principalmente en proyectos que utilizan tecnologías como React, Node.js y TypeScript, aunque es compatible con cualquier entorno de JavaScript.

Jest es conocido por su facilidad de configuración, rapidez en la ejecución de pruebas y características avanzadas como mocking y snapshots, lo que lo convierte en una herramienta preferida para garantizar la calidad del código en proyectos modernos.

![](https://raw.githubusercontent.com/andritowmega/fastmvp/019b2672fd44301bc880458617d656f8d817ebff/public/assetsReadme/jtest-cap-2.PNG)

```bash
npm run test
```
![](https://raw.githubusercontent.com/andritowmega/fastmvp/019b2672fd44301bc880458617d656f8d817ebff/public/assetsReadme/jtest-cap.PNG)


### Postman pruebas funcionales

Con postman se realizaron las pruebas funcionales de las llamadas a la API

![](https://raw.githubusercontent.com/andritowmega/fastmvp/019b2672fd44301bc880458617d656f8d817ebff/public/assetsReadme/test-postman-1.jpg)

![](https://raw.githubusercontent.com/andritowmega/fastmvp/019b2672fd44301bc880458617d656f8d817ebff/public/assetsReadme/test-postman-2.jpg)


### Escaneo con ZAP

![](https://raw.githubusercontent.com/andritowmega/fastmvp/019b2672fd44301bc880458617d656f8d817ebff/public/assetsReadme/test-zap-1.jpg)

![](https://raw.githubusercontent.com/andritowmega/fastmvp/019b2672fd44301bc880458617d656f8d817ebff/public/assetsReadme/test-zap-2.jpg)

### Configuración Inicial

Puedes clonar el proyecto en tu servidor e instalarlo como un proyecto de express. También puedes hacerlo mediante docker directamente

```bash
    git clone https://github.com/andritowmega/fastmvp.git
    cd fastmvp
```

#### Manual

```bash
    npm install
```

#### Con Docker

```bash
    docker build -t fastmvp
```
### Configuración de proyectos
Luego tienes que configurar tus proyectos. Para esto tienes que crear el archivo "configDb.json" en la carpeta config/

```bash
    config/configDb.json
```

```json
{
    "test": {
        "type": "postgres",
        "connection": {
          "user": "user",
          "host": "127.0.0.1",
          "database": "dbname",
          "password": "password",
          "port": 5432
        },
	    "token_secret":"TestT0ken%"
    },
    "project2": {
          "type": "postgres",
          "connection": {
            "user": "user",
            "host": "127.0.0.1",
            "database": "dbname",
            "password": "password",
            "port": 5432
          },
    	    "token_secret":"TestT0ken%"
    }
}
```    

Como puedes ver puedes crear todos los proyectos que desees. En este ejemplo tenemos test y project2. Esos nombres serán con los que podrás llamarlos por la api. token_secret es la clave que usará el modulo de login para detectar usuarios y permitir su acceso

### Tabla accesstoken
En tu base de datos necesitas crear la tabla accesstoken. Este servirá para limitar el acceso a tablas a usuarios que no han iniciado sesión. (Las sesiones son manejadas por el modulo login que son explicadas más adelante) Puede estar vacia si quieres que cualquiera sin token pueda hacer llamadas a tus tablas mediante la API. Pero si deseas limitar el acceso con el token manejado por el modulo login, deberas insertar tus tablas que serán privadas en tablename y marcar access como true.

- accesstoken
    - id_access - Int PK AutoIncrement
    - tablename - varchar
    - access - bool default false


### FastMVP View

La parte visual de FastMVP ingresa a las bases de datos y tablas de tu proyecto en el menú "proyectos"
```bash
localhost:3000/   or yourdomain.com
```
![](https://raw.githubusercontent.com/andritowmega/fastmvp/019b2672fd44301bc880458617d656f8d817ebff/public/assetsReadme/workin1.PNG)

Selecciona tu proyecto, para este ejemplo seleccionamos TopBem:

![](https://raw.githubusercontent.com/andritowmega/fastmvp/019b2672fd44301bc880458617d656f8d817ebff/public/assetsReadme/working2.PNG)

Verás lasa tablas de tu base de datos:

![](https://raw.githubusercontent.com/andritowmega/fastmvp/019b2672fd44301bc880458617d656f8d817ebff/public/assetsReadme/working3.PNG)

Seleccionamos la tabla "product":

![](https://raw.githubusercontent.com/andritowmega/fastmvp/019b2672fd44301bc880458617d656f8d817ebff/public/assetsReadme/working4.PNG)

### FastMVP API
Las llamadas de la api para cada proyecto son dinámicas, puedes obtener datos de tus tablas, insertar datos, hacer joins y usar modules de login y registro para manejar usuarios.

#### Get Data

```bash
POST http://localhost:3000/fm/api/:project/:table/get
```
![](https://raw.githubusercontent.com/andritowmega/fastmvp/019b2672fd44301bc880458617d656f8d817ebff/public/assetsReadme/postman-get.PNG)

##### GetData with limit

![](https://raw.githubusercontent.com/andritowmega/fastmvp/019b2672fd44301bc880458617d656f8d817ebff/public/assetsReadme/postman-get-limit.PNG)

##### GetData with where

![](https://raw.githubusercontent.com/andritowmega/fastmvp/019b2672fd44301bc880458617d656f8d817ebff/public/assetsReadme/postman-get-where.PNG)

#### Insert Data


```bash
POST http://localhost:3000/fm/api/:project/:table/create
```

![](https://raw.githubusercontent.com/andritowmega/fastmvp/019b2672fd44301bc880458617d656f8d817ebff/public/assetsReadme/postman-insert.PNG)

#### Register Module

Puedes registrar datos en las tablas por creadas con los siguientes parametros

- Login: (Estos datos deben ir obligatoriamente como mínimo, pero puedes agregar más)
    - id - PK AutoIncrement
    - email - varchar
    - password - varchar
    - id_profile - int
    - status - bool default true
    - role - smallint default 2

- profile: (puedes agregar más campos si deseas)
    - id_profile - PK AutoIncrement
    - name - varchar
    - phone - varchar
    - address - varchar

Se puede usar la función orderedlist para registrar un usuario con los siguientes parametros:

```bash
POST http://localhost:3000/fm/api/:project/:table/orderedlist
```

![](https://raw.githubusercontent.com/andritowmega/fastmvp/019b2672fd44301bc880458617d656f8d817ebff/public/assetsReadme/postman-module-register.PNG)

Automáticamente hasheara el password en forma segura y guardará los datos en las tablas login y profile.

#### Login Module

Para poder usar login module que ya está listo para trabajar con middlewares y manejar las sesiones en nuestro proyecto se debe tener las tablas del modulo Register:


```bash
POST http://localhost:3000/fm/api/:project/auth/login/token/check
```

![](https://raw.githubusercontent.com/andritowmega/fastmvp/019b2672fd44301bc880458617d656f8d817ebff/public/assetsReadme/postman-module-login.PNG)

#### Inner Join 

```bash
POST http://localhost:3000/fm/api/:project/:table1/innerj/:table2
```

```json
 {
    "keys":{
        "id_profile":"id_profile"
    }
}
```

Para variantes de innerjoin right o left:

```bash
POST http://localhost:3000/fm/api/:project/:table1/innerj/:table2/right
POST http://localhost:3000/fm/api/:project/:table1/innerj/:table2/left
```

![](https://raw.githubusercontent.com/andritowmega/fastmvp/refs/heads/main/public/assetsReadme/innerj.png)

```bash
POST http://localhost:3000/fm/api/:project/auth/login/token/check
```



