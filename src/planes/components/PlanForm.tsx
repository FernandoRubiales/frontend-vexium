import React, { useState } from 'react';
import { Button } from '../../shared/components/Button';

export interface PlanFormData {
    nombre: string;
    precio: number;
}

interface PlanFormProps {
    onSubmit: (data: PlanFormData) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export const PlanForm: React.FC<PlanFormProps> = ({ onSubmit, onCancel, isLoading = false }) => {
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState<number | ''>('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nombre.trim()) {
            setError('El nombre del plan es obligatorio.');
            return;
        }
        if (precio === '' || precio <= 0) {
            setError('El precio debe ser mayor a 0.');
            return;
        }
        setError('');
        onSubmit({ nombre, precio: Number(precio) });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
                <div className="text-red-600 text-sm font-semibold bg-red-50 border border-red-100 p-3 rounded-lg">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-0.5">Nombre del Plan</label>
                <p className="text-xs text-slate-500 mb-2">Ingresa un nombre claro y descriptivo para el plan de entrenamiento.</p>
                <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full bg-white border border-vexium-border text-slate-800 rounded-lg p-2.5 focus:outline-none focus:border-vexium-cyan focus:ring-1 focus:ring-vexium-cyan/25 hover:border-vexium-cyan/50 transition duration-200"
                    placeholder="Ej: Pase Libre Musculación"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-0.5">Precio Mensual</label>
                <p className="text-xs text-slate-500 mb-2">Establece el valor en pesos que abonará el socio de forma periódica.</p>
                <div className="relative rounded-lg">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-slate-400 font-medium text-sm">$</span>
                    </div>
                    <input
                        type="number"
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full bg-white border border-vexium-border text-slate-800 rounded-lg pl-7 pr-3 py-2.5 focus:outline-none focus:border-vexium-cyan focus:ring-1 focus:ring-vexium-cyan/25 hover:border-vexium-cyan/50 transition duration-200"
                        placeholder="Ej: 15000"
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
                <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
                    Cancelar
                </Button>
                <Button type="submit" variant="primary" isLoading={isLoading}>
                    Guardar Plan
                </Button>
            </div>
        </form>
    );
};