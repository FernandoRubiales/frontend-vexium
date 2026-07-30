import Layout from '../../shared/components/Layout';
import Spinner from '../../shared/components/Spinner';
import ErrorMessage from '../../shared/components/ErrorMessage';
import { Table } from '../../shared/components/Table';
import { usePagos } from '../hooks/usePagos';

interface PagoItem {
    id: number;
    nombrePlan: string;
    metodoAbonado: string;
    fechaHoraPago: string;
    montoPago: number;
}

const HistorialPagos = () => {
    const { pagos, cargando, error } = usePagos();

    if (cargando) return <Spinner />;

    const columns = [
        {
            header: 'Plan',
            accessor: 'nombrePlan' as keyof PagoItem,
            className: 'font-medium text-gray-800'
        },
        {
            header: 'Método',
            accessor: (pago: PagoItem) => (
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${pago.metodoAbonado === 'Efectivo'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-sky-50 text-sky-700'
                    }`}>
                    {pago.metodoAbonado}
                </span>
            )
        },
        {
            header: 'Fecha',
            accessor: (pago: PagoItem) => new Date(pago.fechaHoraPago).toLocaleDateString('es-AR'),
            className: 'text-gray-500'
        },
        {
            header: 'Monto',
            accessor: (pago: PagoItem) => `$${pago.montoPago.toLocaleString('es-AR')}`,
            className: 'text-right font-bold text-gray-800'
        }
    ];

    return (
        <Layout>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Historial de Pagos
            </h1>

            {error && <ErrorMessage mensaje={error} />}

            {pagos.length > 0 ? (
                <Table
                    columns={columns}
                    data={pagos}
                    keyExtractor={(pago) => pago.id}
                />
            ) : (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-gray-500 text-sm">
                    No tenés registros de pagos anteriores.
                </div>
            )}
        </Layout>
    );
};

export default HistorialPagos;