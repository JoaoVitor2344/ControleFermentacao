// Wrapper do select com label e mensagem de erro, mesmo padrão do Input
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    error?: string;
    children: React.ReactNode;
}

export default function Select({label, error, children, ...props}: SelectProps) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-navy-dark">{label}</label>
            <select
                className={`border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-yellow/50
  bg-white ${
                    error ? 'border-red' : 'border-blue-gray'
                }`}
                {...props}
            >
                {children}
            </select>
            {error && <span className="text-red text-xs">{error}</span>}
        </div>
    );
}