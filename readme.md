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


## 🧑‍💻 Equipo  

**Nombre del equipo:** 2 Semi Seniors y medio  

**Integrantes:**  
- Andres Carrasco   
- Diego Zanabria
- Luis Ccalluchi


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
                                  "host": "161.132.40.70",
                                  "database": "citygo",
                                  "password": "Citygo2024%",
                                  "port": 5432
                                },
                                "token_secret":"TokenCitygo2024%"
                              },
                              "disronaldo": {
                                "type": "postgres",
                                "connection": {
                                  "user": "fronaldo",
                                  "host": "161.132.40.70",
                                  "database": "fronaldo",
                                  "password": "Fronaldo2024%",
                                  "port": 5432
                                },
                                "token_secret":"TokenRonaldo2024%"
                              },
                              "fronaldo":{
                                "type":"postgres",
                                "connection":{
                                  "user":"andres_ronaldo",
                                  "host":"191.101.15.246",
                                  "database":"andres_ronaldo",
                                  "password":"Ronaldo2024%",
                                  "port": 5432
                                },
                                "token_secret":"RonaldoDistribuidora2024%"
                              },
                              "topbem":{
                                "type":"postgres",
                                "connection":{
                                  "user":"topbem",
                                  "host":"161.132.40.70",
                                  "database":"topbem",
                                  "password":"Topbem2024%",
                                  "port": 5432
                                },
                                "token_secret":"T0pB3m2024%",
                                "cloudflareimages":{
                                  "accountId":"7e4b1e56a752e23daf5a4a9ac4609990",
                                  "apiKey":"-N8lfGW4yj-X6Hb4Do9h71uSM6fyxP75LZy9oG28",
                                  "domain":{
                                    "URI":"https://corefmv.smarttech.pe",
                                    "URIF":"http://localhost"
                                  }
                                }
                              }
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


