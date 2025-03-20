import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { isEmpty, isNil } from 'lodash';

@Injectable()
export class ValidationService {
  // Método para validar si un objeto está vacío o tiene atributos nulos
  isObjectEmptyOrNull(obj: any): boolean {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (value !== null && value !== undefined && value !== '') {
          return false; // Si encuentra un valor no nulo o no vacío, retorna false
        }
      }
    }
    return true; // Si todos los valores son nulos o vacíos, retorna true
  }

  // Método para validar atributos específicos de un objeto
  areAttributesEmptyOrNull(obj: any, attributes: string[]): boolean {
    for (const attr of attributes) {
      const value = obj[attr];
      if (value !== null && value !== undefined && value !== '') {
        return false; // Si encuentra un valor no nulo o no vacío, retorna false
      }
    }
    return true; // Si todos los valores son nulos o vacíos, retorna true
  }

  // Método para validar un objeto usando class-validator
  async validateObject(obj: any): Promise<string[]> {
    const errors = await validate(obj);
    if (errors.length > 0) {
      return errors
        .map((error) => {
          if (error.constraints) {
            return Object.values(error.constraints).join(', ');
          }
          return ''; // Si no hay constraints, retorna una cadena vacía
        })
        .filter((message) => message !== ''); // Filtra los mensajes vacíos
    }
    return []; // Retorna un array vacío si no hay errores
  }

  // Método para validar si un objeto está vacío usando lodash
  isObjectEmpty(obj: any): boolean {
    return isEmpty(obj);
  }

  // Método para validar si un valor es nulo o indefinido usando lodash
  isValueNil(value: any): boolean {
    return isNil(value);
  }
}