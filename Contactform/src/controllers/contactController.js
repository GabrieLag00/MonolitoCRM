import { z } from 'zod';
import Contacto from '../models/contact.js';
import { Op } from 'sequelize'

const contactSchema = z.object({
  nombre: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder los 100 caracteres')
    .trim(),
  email: z
    .string()
    .email('El email debe ser válido')
    .max(100, 'El email no puede exceder los 100 caracteres'),
  mensaje: z
    .string()
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(1000, 'El mensaje no puede exceder los 1000 caracteres')
    .trim(),
  estado: z
    .string()
    .optional()
    .default('pendiente'),
});

const updateSchema = z.object({
  nombre: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder los 100 caracteres')
    .trim()
    .optional(),
  email: z
    .string()
    .email('El email debe ser válido')
    .max(100, 'El email no puede exceder los 100 caracteres')
    .optional(),
  mensaje: z
    .string()
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(1000, 'El mensaje no puede exceder los 1000 caracteres')
    .trim()
    .optional(),
  estado: z
    .string()
    .optional(),
});

const contactController = {
  async createContact(req, res) {
    try {
      const result = contactSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          error: 'Datos inválidos',
          details: result.error.issues.map((issue) => ({
            campo: issue.path.join('.'),
            mensaje: issue.message,
          })),
        });
      }

      const { nombre, email, mensaje, estado } = result.data;
      const contacto = await Contacto.create({ nombre, email, mensaje, estado });

      return res.status(201).json({
        data: contacto,
        status: 201,
        message: 'Contacto creado exitosamente',
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Error al crear contacto',
        details: error.message,
      });
    }
  },

  // contactController.js
async getAllContacts(req, res) {
  try {
    const { pagina = 1, limite = 5, estado, desdeId } = req.query;
    const page = parseInt(pagina, 10);
    const limit = parseInt(limite, 10);

    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      return res.status(400).json({
        error: 'Parámetros de paginación inválidos',
        details: 'pagina y limite deben ser números positivos',
      });
    }

    const where = {
      ...(estado && { estado }),
      ...(desdeId && { id: { [Op.gt]: parseInt(desdeId, 10) } }), // Usar Sequelize Op
    };
    const contactos = await Contacto.findAll({
      where,
      limit,
      order: [['id', 'DESC']], // Ordenar por ID descendente para obtener los más nuevos
      offset: (page - 1) * limit,
    });

    return res.status(200).json({
      data: contactos,
      status: 200,
      message: 'Contactos obtenidos exitosamente',
      total: await Contacto.count({ where }),
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Error al obtener contactos',
      details: error.message,
    });
  }
},

  async getContactById(req, res) {
    try {
      const { id } = req.params;
      const contacto = await Contacto.findByPk(id);

      if (!contacto) {
        return res.status(404).json({
          error: 'Contacto no encontrado',
          details: `No se encontró un contacto con ID ${id}`,
        });
      }

      return res.status(200).json({
        data: contacto,
        status: 200,
        message: 'Contacto obtenido exitosamente',
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Error al obtener contacto',
        details: error.message,
      });
    }
  },

  async updateContact(req, res) {
    try {
      const { id } = req.params;
      const result = updateSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          error: 'Datos inválidos',
          details: result.error.issues.map((issue) => ({
            campo: issue.path.join('.'),
            mensaje: issue.message,
          })),
        });
      }

      const contacto = await Contacto.findByPk(id);
      if (!contacto) {
        return res.status(404).json({
          error: 'Contacto no encontrado',
          details: `No se encontró un contacto con ID ${id}`,
        });
      }

      await contacto.update(result.data);

      return res.status(200).json({
        data: contacto,
        status: 200,
        message: 'Contacto actualizado exitosamente',
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Error al actualizar contacto',
        details: error.message,
      });
    }
  },

  async deleteContact(req, res) {
    try {
      const { id } = req.params;
      const contacto = await Contacto.findByPk(id);
      if (!contacto) {
        return res.status(404).json({
          error: 'Contacto no encontrado',
          details: `No se encontró un contacto con ID ${id}`,
        });
      }

      await contacto.destroy();

      return res.status(200).json({
        data: { message: 'Contacto eliminado' },
        status: 200,
        message: 'Contacto eliminado exitosamente',
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Error al eliminar contacto',
        details: error.message,
      });
    }
  },
};

export default contactController;