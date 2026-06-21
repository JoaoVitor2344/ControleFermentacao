// Wrapper do input com label e mensagem de erro integrados
// "register" vem do React Hook Form — conecta o campo ao formulário
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export default function Input({label, error, ...props}: InputProps) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-navy-dark">{label}</label>
            <input
                className={`border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-yellow/50 ${
                    error ? 'border-red' : 'border-blue-gray'
                }`}
                {...props}
            />
            {error && <span className="text-red text-xs">{error}</span>}
        </div>
    );
}