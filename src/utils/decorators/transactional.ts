import { Injectable, Scope } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

export function Transactional() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const entityManager: EntityManager = this.entityManager; // Inyecta el EntityManager

      return entityManager.transaction(async (transactionalEntityManager) => {
        // Asigna el transactionalEntityManager al servicio
        this.entityManager = transactionalEntityManager;

        // Ejecuta el método original
        const result = await originalMethod.apply(this, args);

        // Restaura el EntityManager original
        this.entityManager = entityManager;

        return result;
      });
    };

    return descriptor;
  };
}