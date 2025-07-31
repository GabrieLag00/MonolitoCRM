import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import Usuario from '../models/user.js';

// Esquema de validación para login y registro
const authSchema = z.object({
  username: z
    .string()
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
    .max(50, 'El nombre de usuario no puede exceder los 50 caracteres')
    .regex(/^[a-zA-Z0-9_-]+$/, 'El nombre de usuario solo puede contener letras, números, guiones y guiones bajos')
    .trim(),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(100, 'La contraseña no puede exceder los 100 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      'La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial (@$!%*?&)'
    ),
});

const loginSchema = z.object({
  username: z.string().min(1, 'El nombre de usuario es requerido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

// Esquema para refresh token
const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'El refresh token es requerido'),
});

const authController = {
  async login(req, res) {
  try {
    const { username, password } = req.body;

    const usuario = await Usuario.findOne({ where: { username } });
    if (!usuario) {
      return res.status(401).json({
        error: "Credenciales inválidas",
        details: "Usuario no encontrado",
      });
    }

    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: "Datos inválidos",
        details: result.error.issues.map((issue) => ({
          campo: issue.path.join("."),
          mensaje: issue.message,
        })),
      });
    }

    const isPasswordValid = await bcrypt.compare(password, usuario.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Credenciales inválidas",
        details: "Contraseña incorrecta",
      });
    }

    const accessToken = jwt.sign(
      { id: usuario.id, username: usuario.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { id: usuario.id, username: usuario.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    await Usuario.update({ refreshToken }, { where: { id: usuario.id } });

   res.cookie("jwt", accessToken, {
    httpOnly: true,
    secure: true,             // Usa HTTPS
    sameSite: "None",         // Permite intercambio entre dominios
    maxAge: 3600000
  });

  res.cookie("refreshJwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 3600000
  });

    return res.status(200).json({
      data: { message: "Login exitoso", accessToken, refreshToken },
      status: 200,
      message: "Autenticación exitosa",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Error al iniciar sesión",
      details: error.message,
    });
  }
},

  async refresh(req, res) {
  try {
    const refreshToken = req.cookies.refreshJwt; // Leer desde la cookie en lugar del cuerpo
    if (!refreshToken) {
      return res.status(401).json({
        error: "Refresh token no válido",
        details: "No se encontró un refresh token en la cookie",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
      return res.status(401).json({
        error: "Refresh token inválido",
        details: "El token proporcionado no es válido",
      });
    }

    const usuario = await Usuario.findOne({ where: { id: decoded.id, refreshToken } });
    if (!usuario) {
      return res.status(401).json({
        error: "Refresh token no válido o usuario no encontrado",
        details: "No se encontró un usuario con el refresh token proporcionado",
      });
    }

    const newAccessToken = jwt.sign(
      { id: usuario.id, username: usuario.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("jwt", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
    });

    return res.status(200).json({
      data: { message: "Token renovado" },
      status: 200,
      message: "Token de acceso renovado exitosamente",
    });
  } catch (error) {
    console.error("Error en refresh:", error);
    return res.status(500).json({
      error: "Error al renovar el token",
      details: error.message,
    });
  }
},

  async register(req, res) {
    try {
      const result = authSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          error: 'Datos inválidos',
          details: result.error.issues.map((issue) => ({
            campo: issue.path.join('.'),
            mensaje: issue.message,
          })),
        });
      }

      const { username, password } = result.data;

      const existingUser = await Usuario.findOne({ where: { username } });
      if (existingUser) {
        return res.status(400).json({
          error: 'El usuario ya existe',
          details: 'El nombre de usuario ya está registrado',
        });
      }

      const usuario = await Usuario.create({ username, password });

      return res.status(201).json({
        data: { id: usuario.id, username: usuario.username },
        status: 201,
        message: 'Usuario creado exitosamente',
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Error al crear usuario',
        details: error.message,
      });
    }
  },
};

export default authController;