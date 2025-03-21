# Etapa de construcción
FROM node:20-alpine AS builder

# Instalar dependencias de compilación
RUN apk add --no-cache python3 make g++

# Instalar @nestjs/cli globalmente
RUN npm install -g @nestjs/cli

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos de dependencias
COPY package*.json ./

# Instalar todas las dependencias (incluyendo devDependencies)
RUN npm ci

# Copiar el resto del código
COPY . .

# Compilar la aplicación
RUN npm run build

# Generar migraciones si no existen
RUN if [ ! -d "src/migrations" ] || [ -z "$(ls -A src/migrations)" ]; then \
    npx typeorm-ts-node-commonjs migration:generate -d src/data-source.ts src/migrations/InitialMigration; \
    fi

# Etapa de producción
FROM node:20-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar package*.json
COPY --from=builder /app/package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production

# Copiar el código compilado desde la etapa de construcción
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/migrations ./src/migrations
COPY --from=builder /app/src/data-source.ts ./src/data-source.ts

# Copiar archivos de configuración (ajustar según tu estructura)
# COPY --from=builder /app/.env.example ./.env.example
COPY --from=builder /app/src/config ./src/config

# Crear un script de inicio
COPY --from=builder /app/scripts/start.sh ./
RUN chmod +x ./start.sh

# Exponer el puerto en el que corre la aplicación
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["./start.sh"]