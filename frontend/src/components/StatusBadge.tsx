import { FermentationStatus } from '../types';

// Mapeia o enum de status para texto em português e cor do design system ArBrain
const config: Record<FermentationStatus, { label: string; className: string }> = {
    [FermentationStatus.WithinPattern]: { label: 'Dentro do Padrão', className: 'bg-green text-navy-dark' },
    [FermentationStatus.Attention]:     { label: 'Atenção',           className: 'bg-yellow text-navy-dark' },
    [FermentationStatus.OutOfPattern]:  { label: 'Fora do Padrão',    className: 'bg-red text-navy-dark' },
};

export default function StatusBadge({ status }: { status: FermentationStatus }) {
    const { label, className } = config[status];
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${className}`}>
            {label}
        </span>
    );
}
