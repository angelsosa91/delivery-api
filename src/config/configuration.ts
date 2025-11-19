/**
 * Configuración centralizada de la aplicación
 * Carga variables de entorno y proporciona valores predeterminados
 */
export default () => ({
  // Configuración del servidor
  port: parseInt(process.env.PORT!, 10) || 3000,
  environment: process.env.NODE_ENV || 'development',
  
  // Configuración de base de datos
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT!, 10) || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'auth_db',
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true',
  },
  
  // Configuración JWT
  jwt: {
    accessToken: {
      secret: process.env.JWT_ACCESS_SECRET || 'accessTokenSecretKey',
      expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m',
    },
    refreshToken: {
      secret: process.env.JWT_REFRESH_SECRET || 'refreshTokenSecretKey',
      expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d',
    },
  },
  
  // Configuración CORS
  corsOrigin: process.env.CORS_ORIGIN || '*',

  // Configuración WhatsApp
  whatsapp: {
    verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || 'your_verify_token',
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
    businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '',
    apiVersion: process.env.WHATSAPP_API_VERSION || 'v17.0',
  },
});