import express from 'express';
import contactRoutes from './routes/contactRoutes.js';
import authRoutes from './routes/authRoutes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { cookieConfig } from './middlewares/cookieMiddleware.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Middleware de logging (temporal para debug)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, {
    origin: req.headers.origin,
    userAgent: req.headers['user-agent'],
    body: req.body
  });
  next();
});

// Middleware para habilitar CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

console.log('Allowed origins:', allowedOrigins);
console.log('NODE_ENV:', process.env.NODE_ENV);

app.use(cors({
  origin: true, // Permite cualquier origen temporalmente
  credentials: true,
}));

app.use(cookieParser());
app.use(cookieConfig); // Middleware para configurar cookies correctamente
// Rutas
app.use('/api', contactRoutes, authRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});