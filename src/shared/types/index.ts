export interface Socio {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    dni: number;
    nombreRol: 'ADMIN' | 'RECEPCIONISTA' | 'SOCIO';
}

export interface Plan {
    id: number;
    nombrePlan: string;
    descripcion: string;
    precio: number;
    diasPorSemana: number;
    clasesIncluidas: number;
    tiposActividades: string[];
}

export interface TipoActividad {
    id: number;
    nombreTipoActividad: string;
    descripcion: string;
}

export interface PlanRequest {
    nombrePlan: string;
    descripcion: string;
    precio: number;
    diasPorSemana: number;
    tiposActividadesIds: number[];
}

export interface SocioPlan {
    id: number;
    nombreSocio: string;
    apellidoSocio: string;
    nombrePlan: string;
    tiposActividades: string[];
    clasesDisponibles: number;
    clasesIncluidas: number;
    fechaInicioSocioPlan: string | null;
    fechaVencimientoSocioPlan: string | null;
    estadoSocioPlan: string;
    precio: number;
}

export interface Clase {
    id: number;
    diaSemana: string;
    horaInicio: string;
    horaFin: string;
    cupoMaximo: number;
    cuposDisponibles: number;
    nombreTipoActividad: string;

}

export interface Reserva {
    id: number;
    claseId: number;
    tipoActividad: string;
    diaSemana: string;
    fechaClaseReservada: string;
    horaInicio: string;
    horaFin: string;
    nombreSocio?: string;
    apellidoSocio?: string;
}

export interface Pago {
    id: number;
    fechaHoraPago: string;
    metodoPago: string;
    montoPago: number;
    myPaymentId: string | null;
    nombreSocio: string;
    apellidoSocio: string;
    nombrePlan: string;
    metodoAbonado: string;
}

export interface ApiError {
    status: number;
    error: string;
    mensaje: string;
    timestamp: string;
}

export interface DistribucionIngreso {
    metodo: string;
    total: number;
}

export interface RankingClase {
    actividad: string;
    cantidadReservas: number;
}

export interface DashboardAdmin {
    ingresosDelMes: number;
    sociosActivos: number;
    distribucionIngresos: DistribucionIngreso[];
    rankingClases: RankingClase[];
}