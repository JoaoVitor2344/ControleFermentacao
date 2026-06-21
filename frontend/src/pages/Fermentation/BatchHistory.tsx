import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getRecordsByBatch } from '../../api/fermentation';
import type { FermentationRecord } from '../../types';
import Button from '../../components/Button';
import Input from '../../components/Input';
import StatusBadge from '../../components/StatusBadge';
import { formatDecimal } from '../../utils/format';

export default function BatchHistory() {
    const [batchNumber, setBatchNumber] = useState('');
    const [records, setRecords] = useState<FermentationRecord[]>([]);
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);

    function handleSearch() {
        if (!batchNumber.trim()) return;
        setLoading(true);
        setSearched(false);

        getRecordsByBatch(batchNumber.trim())
            .then(data => {
                setRecords(data);
                setSearched(true);
            })
            .finally(() => setLoading(false));
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') handleSearch();
    }

    function formatDate(dateStr: string) {
        return new Date(dateStr).toLocaleString('pt-BR');
    }

    // Formata os dados para o gráfico: eixo X = data abreviada, Y = valores numéricos
    const chartData = records.map(r => ({
        date: new Date(r.recordedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        Temperatura: r.temperature,
        pH: r.ph,
        Extrato: r.extract,
    }));

    return (
        <div>
            <h2 className="text-2xl font-bold text-navy-dark mb-6">Histórico de Lotes</h2>

            {/* Barra de busca */}
            <div className="flex gap-3 mb-8 max-w-lg">
                <div className="flex-1">
                    <Input
                        label="Número do Lote"
                        placeholder="Ex: IPA001"
                        value={batchNumber}
                        onChange={e => setBatchNumber(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>
                <div className="pt-6">
                    <Button onClick={handleSearch} disabled={loading}>
                        {loading ? 'Buscando...' : 'Buscar'}
                    </Button>
                </div>
            </div>

            {searched && records.length === 0 && (
                <p className="text-gray">
                    Nenhum apontamento encontrado para o lote <strong>{batchNumber}</strong>.
                </p>
            )}

            {records.length > 0 && (
                <div>
                    <p className="text-sm text-gray mb-6">
                        {records.length} apontamento(s) encontrado(s) para o lote{' '}
                        <strong className="text-navy-dark">{batchNumber}</strong>
                    </p>

                    {/* Gráfico de evolução dos parâmetros ao longo do tempo */}
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                        <h3 className="text-sm font-semibold text-navy-dark mb-4">Evolução do Lote</h3>
                        <ResponsiveContainer width="100%" height={280}>
                            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip
                                    // Formata os valores do tooltip com vírgula (pt-BR)
                                    formatter={(value) => typeof value === 'number' ? formatDecimal(value) : String(value ?? '')}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="Temperatura" stroke="#063852" strokeWidth={2} dot={{ r: 4 }} />
                                <Line type="monotone" dataKey="pH" stroke="#FFC524" strokeWidth={2} dot={{ r: 4 }} />
                                <Line type="monotone" dataKey="Extrato" stroke="#9CDA97" strokeWidth={2} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Tabela detalhada */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-light-gray text-navy-dark font-semibold">
                                <tr>
                                    <th className="text-left px-6 py-3">Data/Hora</th>
                                    <th className="text-left px-6 py-3">Temp. (°C)</th>
                                    <th className="text-left px-6 py-3">pH</th>
                                    <th className="text-left px-6 py-3">Extrato</th>
                                    <th className="text-left px-6 py-3">Observações</th>
                                    <th className="text-left px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.map(record => (
                                    <tr key={record.id} className="border-t border-light-gray">
                                        <td className="px-6 py-4 text-gray whitespace-nowrap">
                                            {formatDate(record.recordedAt)}
                                        </td>
                                        <td className="px-6 py-4 text-navy-dark font-medium">
                                            {formatDecimal(record.temperature)}
                                        </td>
                                        <td className="px-6 py-4 text-navy-dark font-medium">
                                            {formatDecimal(record.ph)}
                                        </td>
                                        <td className="px-6 py-4 text-navy-dark font-medium">
                                            {formatDecimal(record.extract)}
                                        </td>
                                        <td className="px-6 py-4 text-gray">{record.notes || '—'}</td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={record.status} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
