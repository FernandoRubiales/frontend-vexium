interface SelectFilterProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    allLabel?: string;
}

const SelectFilter = ({
    label,
    value,
    onChange,
    options,
    allLabel = 'Todos'
}: SelectFilterProps) => {
    return (
        <div className="flex flex-col">
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
                <option value="">{allLabel}</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SelectFilter;