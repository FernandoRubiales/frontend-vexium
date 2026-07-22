// Tipos que espejean los DTOs del backend

export interface Socio {
    id: number;
    nombre: string;
    apellido: string;
    dni: number;
    email: string;
    telefono: string;
    rol: 'ADMIN' | 'RECEPCIONISTA' | 'SOCIO';
}

export interface SocioRequestDTO {
    nombre: string;
    apellido: string;
    dni: number;
    email: string;
    telefono: string;
}