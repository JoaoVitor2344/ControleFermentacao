import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tank } from '../../types';
import Button from '../../components/Button';
import { deleteTank, getTanks } from '../../api/api.ts';
import { formatDecimal } from '../../utils/format';

export default function TankList() {
    const [tanks, setTanks] = useState<Tank[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDeleted, setShowDeleted] = useState(false);
    const navigate = useNavigate();

    // Rebusca sempre que o toggle de removidos mudar
    useEffect(() => {
        fetchTanks();
    }, [showDeleted]);

    function fetchTanks() {
        setLoading(true);
        getTanks(showDeleted)
            .then(data => setTanks(data))
            .finally(() => setLoading(false));
    }

    function handleDelete(id: string) {
        if (!confirm('Deseja remover este tanque?')) return;
        deleteTank(id).then(() => fetchTanks());
    }

    if (loading) return <p className="text-gray">Carregando...</p>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-navy-dark">Tanques</h2>
                <div className="flex items-center gap-4">
                    {/* Toggle para exibir registros com soft delete aplicado */}
                    <label className="flex items-center gap-2 text-sm text-gray cursor-pointer">
                        <input
                            type="checkbox"
                            checked={showDeleted}
                            onChange={e => setShowDeleted(e.target.checked)}
                            className="accent-yellow"
                        />
                        Mostrar removidos
                    </label>
                    <Button onClick={() => navigate('/tanques/novo')}>+ Novo Tanque</Button>
                </div>
            </div>

            {tanks.length === 0 ? (
                <p className="text-gray">Nenhum tanque cadastrado.</p>
            ) : (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-light-gray text-navy-dark font-semibold">
                            <tr>
                                <th className="text-left px-6 py-3">Nome</th>
                                <th className="text-left px-6 py-3">Capacidade (L)</th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {tanks.map(tank => (
                                <tr
                                    key={tank.id}
                                    // Reduz opacidade de registros removidos para diferenciação visual
                                    className={`border-t border-light-gray ${tank.deletedAt ? 'opacity-50' : ''}`}
                                >
                                    <td className="px-6 py-4 font-medium text-navy-dark">
                                        {tank.name}
                                        {tank.deletedAt && (
                                            <span className="ml-2 text-xs bg-red/20 text-red px-2 py-0.5 rounded-full">
                                                Removido
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-gray">{formatDecimal(tank.capacityLiters)} L</td>
                                    <td className="px-6 py-4 flex gap-2 justify-end">
                                        {!tank.deletedAt && (
                                            <>
                                                <Button variant="secondary" onClick={() => navigate(`/tanques/${tank.id}/editar`)}>
                                                    Editar
                                                </Button>
                                                <Button variant="danger" onClick={() => handleDelete(tank.id)}>
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
