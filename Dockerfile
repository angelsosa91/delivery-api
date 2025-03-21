# Etapa de construcción
FROM node:20-alpine AS builder

# Instalar dependencias de compilación
RUN apk add --no-cache python3 make g++

# Instalar @nestjs/cli globalmente
RUN npm install -g @nestjs/cli

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias de producción
RUN npm ci --only=production

# Copiar el resto del código
COPY . .

# Compilar la aplicación
RUN npm run build

# Etapa de producción
FROM node:20-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar dependencias de producción desde la etapa de construcción
COPY --from=builder /app/node_modules ./node_modules

# Copiar el código compilado desde la etapa de construcción
COPY --from=builder /app/dist ./dist

# Copiar archivos de migraciones y DataSource
COPY --from=builder /app/src/migrations ./src/migrations
COPY --from=builder /app/src/data-source.ts ./src/data-source.ts

# Exponer el puerto en el que corre la aplicación
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["node", "dist/main.js"]