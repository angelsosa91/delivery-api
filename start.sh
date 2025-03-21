#!/bin/sh

# Ejecutar migraciones antes de iniciar la aplicación
echo "Running database migrations..."
npx typeorm-ts-node-commonjs migration:run -d src/data-source.ts

# Iniciar la aplicación
echo "Starting application..."
node dist/main.js