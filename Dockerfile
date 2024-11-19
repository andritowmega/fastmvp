# Usa una imagen base de Node.js
FROM node:20.18.0

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia solo los archivos package.json y package-lock.json primero (optimización de caché)
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código de la aplicación
COPY . .

# Expone el puerto en el que tu app escuchará (por ejemplo, 3000)
EXPOSE 3000

# Comando para ejecutar tu aplicación
CMD ["node", "bin/www"]