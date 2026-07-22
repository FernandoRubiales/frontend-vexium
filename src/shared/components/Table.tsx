import React from 'react';

interface Column<T> {
    header: string;
    accessor: keyof T | ((row: T) => React.ReactNode);
}

interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    keyExtractor: (item: T) => string | number;
    emptyMessage?: string;
}

export const Table = <T,>({ data, columns, keyExtractor, emptyMessage = "No hay datos disponibles" }: TableProps<T>) => {
    return (
        <div className="overflow-x-auto bg-vexium-dark rounded-xl border border-vexium-border shadow-sm">
            <table className="min-w-full text-left text-sm whitespace-nowrap">
                <thead className="uppercase text-xs tracking-wider border-b border-vexium-border bg-[#084d54] text-white font-bold">
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index} className="px-6 py-4">{col.header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="px-6 py-10 text-center text-vexium-text-muted italic">
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((row) => (
                            <tr key={keyExtractor(row)} className="border-b border-vexium-border hover:bg-cyan-50/20 transition duration-200 text-slate-700">
                                {columns.map((col, index) => (
                                    <td key={index} className="px-6 py-4 text-slate-600">
                                        {typeof col.accessor === 'function' ? col.accessor(row) : String(row[col.accessor])}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};