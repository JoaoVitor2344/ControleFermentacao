import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBeers, deleteBeer } from '../../api/beers';
import type { Beer } from '../../types';
import Button from '../../components/Button';
import { formatDecimal } from '../../utils/format';

export default function BeerList() {
    const [beers, setBeers] = useState<Beer[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDeleted, setShowDeleted] = useState(false);
    const navigate = useNavigate();

    // Rebusca sempre que o toggle de removidos mudar
    useEffect(() => {
        fetchBeers();
    }, [showDeleted]);

    function fetchBeers() {
        setLoading(true);
        getBeers(showDeleted)
            .then(data => setBeers(data))
            .finally(() => setLoading(false));
    }

    function handleDelete(id: string) {
        if (!confirm('Deseja remover esta cerveja?')) return;
        deleteBeer(id).then(() => fetchBeers());
    }

    if (loading) return <p className="text-gray">Carregando...</p>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-navy-dark">Cervejas</h2>
                <div className="flex items-center gap-4">
                    {/* Toggle para exibir registros com soft delete aplicado */}
                    <label className="flex items-center gap-2 text-sm text-gray cursor-pointer">
                        <input
                            type="checkbox"
                            checked={showDeleted}
                            onChange={e => setShowDeleted(e.target.checked)}
                            className="accent-yellow"
                        />
                        Mostrar removidas
                    </label>
                    <Button onClick={() => navigate('/cervejas/nova')}>+ Nova Cerveja</Button>
                </div>
            </div>

            {beers.length === 0 ? (
                <p className="text-gray">Nenhuma cerveja cadastrada.</p>
            ) : (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-light-gray text-navy-dark font-semibold">
                            <tr>
                                <th className="text-left px-6 py-3">Nome</th>
                                <th className="text-left px-6 py-3">Estilo</th>
                                <th className="text-left px-6 py-3">Temp. (°C)</th>
                                <th className="text-left px-6 py-3">pH</th>
                                <th className="text-left px-6 py-3">Extrato</th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {beers.map(beer => (
                                <tr
                                    key={beer.id}
                                    // Reduz opacidade de registros removidos para diferenciação visual
                                    className={`border-t border-light-gray ${beer.deletedAt ? 'opacity-50' : ''}`}
                                >
                                    <td className="px-6 py-4 font-medium text-navy-dark">
                                        {beer.name}
                                        {beer.deletedAt && (
                                            <span className="ml-2 text-xs bg-red/20 text-red px-2 py-0.5 rounded-full">
                                                Removida
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-gray">{beer.style}</td>
                                    <td className="px-6 py-4 text-gray">
                                        {formatDecimal(beer.minTemperature)} – {formatDecimal(beer.maxTemperature)}
                                    </td>
                                    <td className="px-6 py-4 text-gray">
                                        {formatDecimal(beer.minPh)} – {formatDecimal(beer.maxPh)}
                                    </td>
                                    <td className="px-6 py-4 text-gray">
                                        {formatDecimal(beer.minExtract)} – {formatDecimal(beer.maxExtract)}
                                    </td>
                                    <td className="px-6 py-4 flex gap-2 justify-end">
                                        {!beer.deletedAt && (
                                            <>
                                                <Button variant="secondary" onClick={() => navigate(`/cervejas/${beer.id}/editar`)}>
                                                    Editar
                                                </Button>
                                                <Button variant="danger" onClick={() => handleDelete(beer.id)}>
                                                    Remover
                                                </Button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
