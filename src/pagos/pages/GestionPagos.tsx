import Layout from '../../shared/components/Layout';
import Spinner from '../../shared/components/Spinner';
import ErrorMessage from '../../shared/components/ErrorMessage';
import { Table } from '../../shared/components/Table';
import { usePagos } from '../hooks/usePagos';

const GestionPagos = () => {
    const { pagos, cargando, error } = usePagos(false);

    if (cargando) return <Spinner />;

    // Definición de columnas con el nombre del socio corregido y solo formato de fecha
    const columnas = [
        {
            header: 'Socio',
            accessor: (pago: any) => (
                <span className="font-semibold text-gray-900">
                    {pago.nombreSocio || pago.nombre || 'Sin nombre'} {pago.apellidoSocio || pago.apellido || ''}
                </span>
            )
        },
        {
            header: 'Plan Abonado',
            accessor: 'nombrePlan' as keyof any
        },
        {
            header: 'Monto',
            accessor: (pago: any) => (
                <span className="font-bold text-emerald-600">
                    ${Number(pago.montoPago).toLocaleString('es-AR')}
                </span>
            )
        },
        {
            header: 'Método',
            accessor: (pago: any) => (
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${pago.metodoAbonado === 'Efectivo'
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-blue-50 text-blue-700'
                    }`}>
                    {pago.metodoAbonado}
                </span>
            )
        },
        {
            header: 'Fecha de Pago',
            accessor: (pago: any) => (
                <span className="text-gray-500 text-xs">
                    {pago.fechaHoraPago ? new Date(pago.fechaHoraPago).toLocaleDateString('es-AR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    }) : '-'}
                </span>
            )
        }
    ];

    return (
        <Layout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Control de Pagos</h1>
            </div>

            {error && <ErrorMessage mensaje={error} />}

            {pagos.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-gray-400 text-sm">
                    No hay pagos registrados todavía.
                </div>
            ) : (
                <Table
                    columns={columnas}
                    data={pagos}
                    keyExtractor={pago => pago.id}
                />
            )}
        </Layout>
    );
};

export default GestionPagos;