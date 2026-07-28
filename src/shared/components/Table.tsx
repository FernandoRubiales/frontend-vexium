interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    className?: string;
}

interface TableProps<T> {
    columns: Column<T>[];
    data: T[];
    keyExtractor: (item: T) => string | number;
}

export function Table<T>({ columns, data, keyExtractor }: TableProps<T>) {
    return (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {columns.map((col, index) => (
                            <th key={index} className={`p-4 ${col.className || ''}`}>
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                    {data.map(item => (
                        <tr key={keyExtractor(item)} className="hover:bg-gray-50/50 transition">
                            {columns.map((col, colIndex) => {
                                const value = typeof col.accessor === 'function'
                                    ? col.accessor(item)
                                    : (item[col.accessor] as React.ReactNode);

                                return (
                                    <td key={colIndex} className={`p-4 ${col.className || ''}`}>
                                        {value}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}