// Mapeia o status retornado pelo backend para texto em português e cor do Figma
type Status = 'WithinPattern' | 'Attention' | 'OutOfPattern';

const config: Record<Status, { label: string; className: string }> = {
    WithinPattern: {label: 'Dentro do Padrão', className: 'bg-green text-navy-dark'},
    Attention: {label: 'Atenção', className: 'bg-yellow text-navy-dark'},
    OutOfPattern: {label: 'Fora do Padrão', className: 'bg-red text-navy-dark'},
};

export default function StatusBadge({status}: { status: Status }) {
    const {label, className} = config[status];
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${className}`}>
        {label}
      </span>
    );
}