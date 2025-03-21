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
COPY --from=builder /app/src ./src

# Copiar archivos de configuración adicionales si existen
COPY --from=builder /app/.env* ./

# Crear script de inicio
RUN echo '#!/bin/sh\n\n# Ejecutar migraciones antes de iniciar la aplicación\necho "Running database migrations..."\nnpx typeorm-ts-node-commonjs migration:run -d src/data-source.ts\n\n# Iniciar la aplicación\necho "Starting application..."\nnode dist/main.js' > start.sh
RUN chmod +x ./start.sh

# Exponer el puerto en el que corre la aplicación
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["./start.sh"]