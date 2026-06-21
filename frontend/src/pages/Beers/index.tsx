import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {getBeers, deleteBeer} from '../../api/beers';
import Button from '../../components/Button';
import type {Beer} from "../../types";

export default function BeerList() {
    const [beers, setBeers] = useState<Beer[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Carrega a lista ao montar a página
    useEffect(() => {
        fetchBeers();
    }, []);

    function fetchBeers() {
        setLoading(true);
        getBeers()
            .then(data => setBeers(data))
            .finally(() => setLoading(false));
    }

    function handleDelete(id: string) {
        // Confirmação simples antes de deletar
        if (!confirm('Deseja remover esta cerveja?')) return;
        deleteBeer(id).then(() => fetchBeers());
    }

    if (loading) return <p className="text-gray">Carregando...</p>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-navy-dark">Cervejas</h2>
                <Button onClick={() => navigate('/cervejas/nova')}>+ Nova Cerveja</Button>
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
                            <tr key={beer.id} className="border-t border-light-gray">
                                <td className="px-6 py-4 font-medium text-navy-dark">{beer.name}</td>
                                <td className="px-6 py-4 text-gray">{beer.style}</td>
                                <td className="px-6 py-4 text-gray">{beer.minTemperature} – {beer.maxTemperature}</td>
                                <td className="px-6 py-4 text-gray">{beer.minPh} – {beer.maxPh}</td>
                                <td className="px-6 py-4 text-gray">{beer.minExtract} – {beer.maxExtract}</td>
                                <td className="px-6 py-4 flex gap-2 justify-end">
                                    <Button variant="secondary" onClick={() => navigate(`/cervejas/${beer.id}/editar`)}>
                                        Editar
                                    </Button>
                                    <Button variant="danger" onClick={() => handleDelete(beer.id)}>
                                        Remover
                                    </Button>
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