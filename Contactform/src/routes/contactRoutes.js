import express from 'express';
import contactController from '../controllers/contactController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();


// Rutas de contactos (protegidas con authMiddleware)
router.post('/contactos', contactController.createContact);
router.get('/contactos', authMiddleware, contactController.getAllContacts);
router.get('/contactos/:id', authMiddleware, contactController.getContactById);
router.put('/contactos/:id', authMiddleware, contactController.updateContact);
router.delete('/contactos/:id', authMiddleware, contactController.deleteContact);

export default router;