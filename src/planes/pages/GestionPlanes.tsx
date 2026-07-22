import { useEffect, useState } from 'react';
// import { api } from '../../shared/api/axios'; // Comentado hasta enchufar Java
import { Table } from '../../shared/components/Table';
import { Button } from '../../shared/components/Button';
import { Spinner } from '../../shared/components/Spinner';
import { Modal } from '../../shared/components/Modal';
import { PlanForm, type PlanFormData } from '../components/PlanForm';

interface Plan {
    id: number;
    nombre: string;
    precio: number;
}

export const GestionPlanes = () => {
    const [planes, setPlanes] = useState<Plan[]>([]);
    const [cargando, setCargando] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setPlanes([
                { id: 1, nombre: 'Pase Libre', precio: 15000 },
                { id: 2, nombre: 'Musculación 3x Sem', precio: 12000 },
            ]);
            setCargando(false);
        }, 1000);
    }, []);

    const handleCrearPlan = async (datosNuevoPlan: PlanFormData) => {
        setIsSaving(true);
        try {
            // Simulación de guardado
            setTimeout(() => {
                const nuevoPlanSimulado = {
                    id: Math.floor(Math.random() * 1000),
                    ...datosNuevoPlan
                };
                setPlanes([...planes, nuevoPlanSimulado]);
                setIsModalOpen(false);
                setIsSaving(false);
            }, 800);
        } catch (error) {
            console.error("Error al crear plan", error);
            setIsSaving(false);
        }
    };

    const columnas = [
        { header: 'ID', accessor: 'id' as keyof Plan },
        { header: 'Nombre del Plan', accessor: 'nombre' as keyof Plan },
        {
            header: 'Precio ($)',
            accessor: (plan: Plan) => <span className="font-bold text-vexium-cyan">${plan.precio}</span>
        },
        {
            header: 'Acciones',
            accessor: (plan: Plan) => (
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => alert(`Editar ${plan.nombre}`)}>Editar</Button>
                    <Button variant="danger" onClick={() => alert(`Borrar ${plan.nombre}`)}>Eliminar</Button>
                </div>
            )
        }
    ];

    return (
        <div className="p-2">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black text-slate-800 tracking-wide">Gestión de Planes</h2>
                <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                    + Nuevo Plan
                </Button>
            </div>

            {cargando ? (
                <div className="flex justify-center py-20">
                    <Spinner size="lg" color="text-vexium-cyan" />
                </div>
            ) : (
                <Table
                    data={planes}
                    columns={columnas}
                    keyExtractor={(plan) => plan.id}
                    emptyMessage="No hay planes cargados en el sistema."
                />
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Crear Nuevo Plan"
            >
                <PlanForm
                    onSubmit={handleCrearPlan}
                    onCancel={() => setIsModalOpen(false)}
                    isLoading={isSaving}
                />
            </Modal>
        </div>
    );
};