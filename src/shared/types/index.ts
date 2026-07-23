export interface Socio {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    dni: number;
    rol: 'ADMIN' | 'RECEPCIONISTA' | 'SOCIO';
}

export interface Plan {
    id: number;
    nombrePlan: string;
    descripcion: string;
    precio: number;
    diasPorSemana: number;
    clasesIncluidas: number;
    tipoActividad: string;
}

export interface SocioPlan {
    id: number;
    nombreSocio: string;
    apellidoSocio: string;
    nombrePlan: string;
    tipoActividad: string;
    clasesDisponibles: number;
    clasesIncluidas: number;
    fechaInicioSocioPlan: string | null;
    fechaVencimientoSocioPlan: string | null;
    estadoMembresia: string;
}

export interface Clase {
    id: number;
    diaSemana: string;
    horaInicio: string;
    horaFin: string;
    cupoMaximo: number;
    cuposDisponibles: number;
    nombreTipoActividad: string;
    requiereReserva: boolean;
}

export interface Reserva {
    id: number;
    fechaHoraReserva: string;
    tipoActividad: string;
    diaSemana: string;
    horaInicio: string;
    horaFin: string;
}

export interface Pago {
    id: number;
    fechaHoraPago: string;
    metodoPago: string;
    montoPago: number;
    nombreSocio: string;
    apellidoSocio: string;
    nombrePlan: string;
}

export interface ApiError {
    status: number;
    error: string;
    mensaje: string;
    timestamp: string;
}