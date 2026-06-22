import {useEffect, useState} from "react";
import {getSummary} from "../../api/fermentation.ts";
import type {FermentationSummary} from "../../types";

export default function Dashboard() {
    // Estado que guarda os dados vindos da API
    const [summary, setSummary] = useState<FermentationSummary | null>(null);
    const [loading, setLoading] = useState(true);

    // executa uma única vez quando a página carrega
    useEffect(() => {
        getSummary()
            .then(data => setSummary(data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return null;
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-navy-dark mb-6">Dashboard</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryCard
                    label="Total de Registros"
                    value={summary?.totalRecords ?? 0}
                    color="border-navy"
                />
                <SummaryCard
                    label="Dentro do Padrão"
                    value={summary?.withinPattern ?? 0}
                    color="border-green"
                />
                <SummaryCard
                    label="Atenção"
                    value={summary?.attention ?? 0}
                    color="border-yellow"
                />
                <SummaryCard
                    label="Fora do Padrão"
                    value={summary?.outOfPattern ?? 0}
                    color="border-red"
                />
            </div>
        </div>
    );
}

// Componente auxiliar do card
function SummaryCard({label, value, color}: { label: string; value: number; color: string }) {
    return (
        <div className={`bg-white rounded-xl p-6 border-l-4 ${color} shadow-sm`}>
            <p className="text-gray text-sm font-medium">{label}</p>
            <p className="text-navy-dark text-4xl font-bold mt-2">{value}</p>
        </div>
    );
}
