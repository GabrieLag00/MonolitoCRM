import { Sequelize } from 'sequelize';

// Debug environment variables
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_DATABASE:', process.env.DB_DATABASE);
console.log('DB_PORT:', process.env.DB_PORT);

if (!process.env.DB_HOST || !process.env.DB_DATABASE) {
  throw new Error('DB_HOST or DB_DATABASE is not defined in .env file');
}

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT) || 3306,
  // ... resto de la configuración
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('¡Conexión a MySQL establecida exitosamente con Sequelize!');
  } catch (error) {
    console.error('Database connection error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
    throw new Error(`Failed to connect to database: ${error.message}`);
  }
})();

export default sequelize;