import type { ReactNode } from 'react';

export interface Column<T> {
    header: string;
    accessor: keyof T | ((row: T) => ReactNode);
}

interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    keyExtractor: (item: T) => string | number;
    emptyMessage?: string;
}

export const Table = <T,>({ data, columns, keyExtractor, emptyMessage = "No hay registros disponibles" }: TableProps<T>) => {
    return (
        <div className="w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-[#115E59] text-white text-xs uppercase tracking-wider">
                        <tr>
                            {columns.map((col, index) => (
                                <th key={index} className="px-6 py-4 font-bold">{col.header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500 italic">
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            data.map((row) => (
                                <tr key={keyExtractor(row)} className="hover:bg-gray-50 transition-colors">
                                    {columns.map((col, index) => (
                                        <td key={index} className="px-6 py-4 whitespace-nowrap">
                                            {typeof col.accessor === 'function' ? col.accessor(row) : String(row[col.accessor])}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};