import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorador para extraer el usuario o propiedades específicas del usuario
 * desde la request actual.
 * 
 * Ejemplo:
 * @GetUser() user: User                - Obtiene todo el usuario
 * @GetUser('id') userId: string        - Obtiene solo el ID del usuario
 * @GetUser('email') userEmail: string  - Obtiene solo el email del usuario
 */
export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // Si no hay usuario, devolver null
    if (!user) {
      return null;
    }

    // Retornar una propiedad específica o el usuario completo
    return data ? user[data] : user;
  },
);