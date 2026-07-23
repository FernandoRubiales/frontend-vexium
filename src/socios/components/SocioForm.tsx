import React, { useState } from 'react';
import { Button } from '../../shared/components/Button';
import type { SocioRequestDTO } from '../types/socio.types';

interface SocioFormProps {
    onSubmit: (data: SocioRequestDTO) => void;
    onCancel: () => void;
    isLoading?: boolean;
    initialData?: SocioRequestDTO;
}

export const SocioForm: React.FC<SocioFormProps> = ({
    onSubmit,
    onCancel,
    isLoading = false,
    initialData
}) => {
    const [nombre, setNombre] = useState(initialData?.nombre || '');
    const [apellido, setApellido] = useState(initialData?.apellido || '');
    const [dni, setDni] = useState<number | ''>(initialData?.dni || '');
    const [email, setEmail] = useState(initialData?.email || '');
    const [telefono, setTelefono] = useState(initialData?.telefono || '');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nombre.trim() || !apellido.trim() || !email.trim() || !telefono.trim()) {
            setError('Todos los campos son obligatorios.');
            return;
        }
        if (dni === '' || dni <= 0) {
            setError('El DNI debe ser un número válido.');
            return;
        }
        setError('');
        onSubmit({
            nombre,
            apellido,
            dni: Number(dni),
            email,
            telefono
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
                <div className="text-red-600 text-sm font-semibold bg-red-50 border border-red-100 p-3 rounded-lg">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre</label>
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="w-full bg-white border border-gray-300 text-slate-800 rounded-lg p-2.5 focus:outline-none focus:border-[#00ADB5] focus:ring-1 focus:ring-[#00ADB5]/25 hover:border-gray-400 transition duration-200 text-sm"
                        placeholder="Ej: Juan"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Apellido</label>
                    <input
                        type="text"
                        value={apellido}
                        onChange={(e) => setApellido(e.target.value)}
                        className="w-full bg-white border border-gray-300 text-slate-800 rounded-lg p-2.5 focus:outline-none focus:border-[#00ADB5] focus:ring-1 focus:ring-[#00ADB5]/25 hover:border-gray-400 transition duration-200 text-sm"
                        placeholder="Ej: Pérez"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">DNI</label>
                <input
                    type="number"
                    value={dni}
                    onChange={(e) => setDni(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-white border border-gray-300 text-slate-800 rounded-lg p-2.5 focus:outline-none focus:border-[#00ADB5] focus:ring-1 focus:ring-[#00ADB5]/25 hover:border-gray-400 transition duration-200 text-sm"
                    placeholder="Ej: 38445992"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Correo Electrónico</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-gray-300 text-slate-800 rounded-lg p-2.5 focus:outline-none focus:border-[#00ADB5] focus:ring-1 focus:ring-[#00ADB5]/25 hover:border-gray-400 transition duration-200 text-sm"
                    placeholder="Ej: juan.perez@example.com"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Teléfono</label>
                <input
                    type="text"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="w-full bg-white border border-gray-300 text-slate-800 rounded-lg p-2.5 focus:outline-none focus:border-[#00ADB5] focus:ring-1 focus:ring-[#00ADB5]/25 hover:border-gray-400 transition duration-200 text-sm"
                    placeholder="Ej: +54 9 11 5555-5555"
                />
            </div>

            <div className="flex justify-end gap-3 mt-6">
                <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
                    Cancelar
                </Button>
                <Button type="submit" variant="primary" isLoading={isLoading}>
                    Guardar Socio
                </Button>
            </div>
        </form>
    );
};
