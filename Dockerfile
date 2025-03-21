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

# Instalar todas las dependencias (incluyendo devDependencies)
RUN npm ci

# Copiar el resto del código
COPY . .

# Compilar la aplicación
RUN npm run build

# Generar migraciones
RUN npx typeorm-ts-node-commonjs migration:generate -d src/data-source.ts src/migrations/InitialMigration

# Etapa de producción
FROM node:20-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar package*.json
COPY --from=builder /app/package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production

# Copiar el código compilado y los archivos necesarios
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/migrations ./src/migrations
COPY --from=builder /app/src/data-source.ts ./src/data-source.ts

# IMPORTANTE: Copiar la carpeta completa de configuración
COPY --from=builder /app/src/config ./src/config

# Copiar archivos de configuración adicionales si existen
COPY --from=builder /app/.env* ./

# Ejecutar migraciones
RUN npx typeorm-ts-node-commonjs migration:run -d src/data-source.ts

# Exponer el puerto en el que corre la aplicación
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["node", "dist/main.js"]