import sequelize from '../config/db.js';
import Usuario from '../models/user.js';

async function insertUsuario() {
  
  try {
    // Debug: Mostrar variables de entorno
    console.log('DB_HOST:', process.env.DB_HOST);
    console.log('DB_DATABASE:', process.env.DB_DATABASE);
    console.log('DB_PORT:', process.env.DB_PORT);
    console.log('DB_USERNAME:', process.env.DB_USERNAME);

    // Sincronizar la base de datos (crea la tabla si no existe)
    await sequelize.sync({ force: false }); // force: false para no eliminar datos existentes

    // Insertar un usuario
    const usuario = await Usuario.create({
      username: 'juanperez',
      password: 'Contraseña123!', // Cumple con los requisitos de Zod
    });

    console.log('Usuario creado exitosamente:', usuario.toJSON());
  } catch (error) {
    console.error('Error al crear usuario:', error.message);
  } finally {
    await sequelize.close(); // Cerrar la conexión
  }
}


insertUsuario();