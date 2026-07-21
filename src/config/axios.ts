import axios from 'axios';

// Creamos una instancia configurada con la URL de tu Spring Boot
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/vexium',
});

