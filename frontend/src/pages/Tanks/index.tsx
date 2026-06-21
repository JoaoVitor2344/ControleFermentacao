import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import type {Tank} from '../../types';
import Button from '../../components/Button';
import {deleteTank, getTanks} from "../../api/api.ts";

export default function TankList() {
    const [tanks, setTanks] = useState<Tank[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTanks();
    }, []);

    function fetchTanks() {
        setLoading(true);
        getTanks()
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
                <Button onClick={() => navigate('/tanques/novo')}>+ Novo Tanque</Button>
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
                            <tr key={tank.id} className="border-t border-light-gray">
                                <td className="px-6 py-4 font-medium text-navy-dark">{tank.name}</td>
                                <td className="px-6 py-4 text-gray">{tank.capacityLiters} L</td>
                                <td className="px-6 py-4 flex gap-2 justify-end">
                                    <Button variant="secondary" onClick={() => navigate(`/tanques/${tank.id}/editar`)}>
                                        Editar
                                    </Button>
                                    <Button variant="danger" onClick={() => handleDelete(tank.id)}>
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