import type { IContacto } from '@/types/Contacto';
import type { ResponseHelper } from '@/types/ResponseHelper';
import { GenericRequest } from '@/api/GenericRequest';

const urlBase = "api";

// POST: '/api/contactos'
export async function PostContactos(contacto: IContacto, authToken?: string): Promise<ResponseHelper<IContacto> | null> {
  return await GenericRequest<IContacto>({
    url: `${urlBase}/contactos`,
    method: 'POST',
    data: {
      nombre: contacto.nombre,
      email: contacto.email,
      mensaje: contacto.mensaje,
      estado: contacto.estado,
    },
    authToken,
  });
}

// GET: '/api/contactos?pagina=x&limite=y&estado=z'
export async function GetContactos(page: number = 1, limit: number = 10, estado?: string): Promise<ResponseHelper<IContacto[]> | null> {
  return await GenericRequest<IContacto[]>({
    url: `${urlBase}/contactos`,
    method: 'GET',
    params: {
      pagina: page,
      limite: limit,
      ...(estado && { estado }),
    },
  });
}

export async function GetNewContacts(desdeId?: number): Promise<ResponseHelper<IContacto[]> | null> {
  return await GenericRequest<IContacto[]>({
    url: `${urlBase}/contactos`,
    method: 'GET',
    params: {
      limite: 5, // Solo los últimos 5 para eficiencia
      ...(desdeId && { desdeId }), // Filtrar por ID mayor al último procesado
    },
  });
}

// GET: '/api/contactos/:id'
export async function GetContactoById(id: number): Promise<ResponseHelper<IContacto> | null> {
  return await GenericRequest<IContacto>({
    url: `${urlBase}/contactos/${id}`,
    method: 'GET',
  });
}

// PUT: '/api/contactos/:id'
export async function PutContacto(id: number, updates: Partial<IContacto>): Promise<ResponseHelper<IContacto> | null> {
  return await GenericRequest<IContacto>({
    url: `${urlBase}/contactos/${id}`,
    method: 'PUT',
    data: updates,
  });
}

// DELETE: '/api/contactos/:id'
export async function DeleteContacto(id: number): Promise<ResponseHelper<{ message: string }> | null> {
  return await GenericRequest<{ message: string }>({
    url: `${urlBase}/contactos/${id}`,
    method: 'DELETE',
  });
}

