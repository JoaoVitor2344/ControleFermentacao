import {useEffect, useState} from 'react';
import {LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import {getAllFermentationRecords, getAllBatches} from '../../api/fermentation';
import {getBeers} from '../../api/beers';
import {getTanks} from '../../api/api';
import {FermentationStatus, type Beer, type FermentationRecord, type Tank} from '../../types';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Modal from '../../components/Modal';
import StatusBadge from '../../components/StatusBadge';
import RegisterFermentationForm from './RegisterFermentationForm';
import EditFermentationRecordForm from './EditFermentationRecordForm';
import {formatDateTime, formatDecimal, formatShortDate} from '../../utils/format';
import {EyeIcon, GearIcon, PlusIcon, SortIcon} from '../../components/icons';
import ButtonTooltip from '../../components/Tooltip';
import SearchIcon from '../../components/SearchIcon';
import ActionMenu from '../../components/ActionMenu';

const PAGE_SIZE_OPTIONS = [10, 25, 50];
const STATUS_OPTIONS = [
    {value: '', label: 'Todos os status'},
    {value: FermentationStatus.WithinPattern, label: 'Dentro do Padrão'},
    {value: FermentationStatus.Attention, label: 'Atenção'},
    {value: FermentationStatus.OutOfPattern, label: 'Fora do Padrão'},
];

export default function Fermentation() {
    const [records, setRecords] = useState<FermentationRecord[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(true);

    // filtros (estado dos campos)
    const [filterBeerId, setFilterBeerId] = useState('');
    const [filterTankId, setFilterTankId] = useState('');
    const [filterBatchNumber, setFilterBatchNumber] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    // filtros aplicados (confirmados pelo Buscar)
    const [appliedBeerId, setAppliedBeerId] = useState('');
    const [appliedTankId, setAppliedTankId] = useState('');
    const [appliedBatchNumber, setAppliedBatchNumber] = useState('');
    const [appliedStatus, setAppliedStatus] = useState('');

    const [sortAscending, setSortAscending] = useState(false);

    const [beers, setBeers] = useState<Beer[]>([]);
    const [tanks, setTanks] = useState<Tank[]>([]);
    const [batches, setBatches] = useState<string[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<FermentationRecord | null>(null);
    const [viewingRecord, setViewingRecord] = useState<FermentationRecord | null>(null);

    const isFiltered = !!(appliedBeerId || appliedTankId || appliedBatchNumber || appliedStatus);
    const showChart = !!(appliedBatchNumber && records.length > 0);

    useEffect(() => {
        Promise.all([getBeers(), getTanks(), getAllBatches()]).then(([b, t, bat]) => {
            setBeers(b);
            setTanks(t);
            setBatches(bat);
        });
    }, []);

    useEffect(() => {
        fetchRecords();
    }, [page, pageSize, appliedBeerId, appliedTankId, appliedBatchNumber, appliedStatus, sortAscending]);

    function fetchRecords() {
        setLoading(true);
        getAllFermentationRecords(page, pageSize, {
            beerId: appliedBeerId || undefined,
            tankId: appliedTankId || undefined,
            batchNumber: appliedBatchNumber || undefined,
            status: appliedStatus || undefined,
            ascending: sortAscending || undefined,
        })
            .then(data => {
                setRecords(data.items);
                setTotalCount(data.totalCount);
                setTotalPages(data.totalPages);
            })
            .finally(() => setLoading(false));
    }

    function handleSearch() {
        setPage(1);
        setAppliedBeerId(filterBeerId);
        setAppliedTankId(filterTankId);
        setAppliedBatchNumber(filterBatchNumber);
        setAppliedStatus(filterStatus);
    }

    function clearFilters() {
        setFilterBeerId('');
        setFilterTankId('');
        setFilterBatchNumber('');
        setFilterStatus('');
        setPage(1);
        setAppliedBeerId('');
        setAppliedTankId('');
        setAppliedBatchNumber('');
        setAppliedStatus('');
    }

    function handleModalClose() {
        setModalOpen(false);
        fetchRecords();
    }

    function formatDate(dateStr: string) {
        return formatDateTime(dateStr);
    }

    const chartData = records.map(r => ({
        date: formatShortDate(r.recordedAt),
        Temperatura: r.temperature,
        pH: r.ph,
        Extrato: r.extract,
    }));

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-navy-dark">Fermentação</h2>
                <ButtonTooltip content="Registrar Apontamento">
                    <Button onClick={() => setModalOpen(true)} aria-label="Registrar Apontamento">
                        <PlusIcon className="w-4 h-4"/>
                    </Button>
                </ButtonTooltip>
            </div>

            {/* Card de filtros */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4 items-end">
                    <Select
                        label="Cerveja"
                        value={filterBeerId}
                        onChange={e => setFilterBeerId(e.target.value)}
                    >
                        <option value="">Todas as cervejas</option>
                        {beers.map(b => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                    </Select>

                    <Select
                        label="Tanque"
                        value={filterTankId}
                        onChange={e => setFilterTankId(e.target.value)}
                    >
                        <option value="">Todos os tanques</option>
                        {tanks.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </Select>

                    <Select
                        label="Número do Lote"
                        value={filterBatchNumber}
                        onChange={e => setFilterBatchNumber(e.target.value)}
                    >
                        <option value="">Todos os lotes</option>
                        {batches.map(b => (
                            <option key={b} value={b}>{b}</option>
                        ))}
                    </Select>

                    <Select
                        label="Status"
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                    >
                        {STATUS_OPTIONS.map(option => (
                            <option key={option.value || 'all'} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </Select>

                    <div className="flex gap-2">
                        <Button variant="search" onClick={handleSearch}>
                            <SearchIcon/> Buscar
                        </Button>
                        {isFiltered && (
                            <Button variant="secondary" onClick={clearFilters}>Limpar</Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Contador + toggle de ordenação */}
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray">
                    {!loading && `${totalCount} registro(s) encontrado(s)`}
                </p>
                <button
                    type="button"
                    aria-pressed={sortAscending}
                    aria-label={sortAscending ? 'Ordenar por mais recente primeiro' : 'Ordenar por mais antigo primeiro'}
                    onClick={() => { setSortAscending(a => !a); setPage(1); }}
                    className="flex items-center gap-2 text-sm text-gray cursor-pointer rounded outline-none focus:ring-2 focus:ring-yellow/50"
                >
                    <SortIcon className="w-4 h-4"/>
                    {sortAscending ? 'Mais recente primeiro' : 'Mais antigo primeiro'}
                </button>
            </div>

            {/* Gráfico — somente quando filtro de lote ativo */}
            {showChart && (
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <h3 className="text-sm font-semibold text-navy-dark mb-4">
                        Evolução do Lote — {appliedBatchNumber}
                    </h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={chartData} margin={{top: 5, right: 20, left: 0, bottom: 5}}>
                            <XAxis dataKey="date" tick={{fontSize: 12}}/>
                            <YAxis tick={{fontSize: 12}}/>
                            <Tooltip
                                formatter={(value) => typeof value === 'number' ? formatDecimal(value) : String(value ?? '')}
                            />
                            <Legend/>
                            <Line type="monotone" dataKey="Temperatura" stroke="#063852" strokeWidth={2} dot={{r: 4}}/>
                            <Line type="monotone" dataKey="pH" stroke="#FFC524" strokeWidth={2} dot={{r: 4}}/>
                            <Line type="monotone" dataKey="Extrato" stroke="#9CDA97" strokeWidth={2} dot={{r: 4}}/>
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Tabela */}
            {!loading && records.length === 0 ? (
                <p className="text-gray">Nenhum registro encontrado.</p>
            ) : (
                <>
                <div className="sm:hidden bg-white rounded-xl shadow-sm divide-y divide-light-gray">
                    {records.map(record => (
                        <div key={record.id} className="p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="font-medium text-navy-dark">Lote {record.batchNumber}</p>
                                    <p className="mt-1 text-sm text-gray">{formatDate(record.recordedAt)}</p>
                                </div>
                                <StatusBadge status={record.status}/>
                            </div>

                            <div className="mt-4 flex gap-2 border-t border-light-gray pt-3">
                                <Button variant="view" onClick={() => setViewingRecord(record)}>
                                    <EyeIcon className="w-4 h-4"/> Visualizar
                                </Button>
                                <ActionMenu
                                    label={`lote ${record.batchNumber}`}
                                    onEdit={() => setEditingRecord(record)}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="hidden sm:block bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[900px]">
                        <thead className="bg-light-gray text-navy-dark font-semibold">
                        <tr>
                            <th className="text-left px-6 py-3">Lote</th>
                            <th className="text-left px-6 py-3">Data/Hora</th>
                            <th className="text-right whitespace-nowrap px-6 py-3">Temp. (°C)</th>
                            <th className="text-right whitespace-nowrap px-6 py-3">pH</th>
                            <th className="text-right whitespace-nowrap px-6 py-3">Extrato</th>
                            <th className="text-left px-6 py-3">Observações</th>
                            <th className="text-left px-6 py-3">Status</th>
                            <th className="px-6 py-3"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {records.map(record => (
                            <tr key={record.id} className="border-t border-light-gray">
                                <td className="px-6 py-4 font-medium text-navy-dark">{record.batchNumber}</td>
                                <td className="px-6 py-4 text-gray whitespace-nowrap">
                                    {formatDate(record.recordedAt)}
                                </td>
                                <td className="px-6 py-4 text-right text-navy-dark font-medium">
                                    {formatDecimal(record.temperature)}
                                </td>
                                <td className="px-6 py-4 text-right text-navy-dark font-medium">
                                    {formatDecimal(record.ph)}
                                </td>
                                <td className="px-6 py-4 text-right text-navy-dark font-medium">
                                    {formatDecimal(record.extract)}
                                </td>
                                <td className="px-6 py-4 text-gray">{record.notes || '—'}</td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={record.status}/>
                                </td>
                                <td className="px-6 py-4">
                                    <ButtonTooltip content="Editar">
                                        <Button variant="outline" onClick={() => setEditingRecord(record)} aria-label="Editar">
                                            <GearIcon className="w-4 h-4"/>
                                        </Button>
                                    </ButtonTooltip>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                  </div>
                </div>
                </>
            )}

            {/* Paginação */}
            {totalPages > 1 && (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-4">
                    <div className="flex items-center gap-2 text-sm text-gray">
                        <span>Itens por página:</span>
                        <select
                            value={pageSize}
                            onChange={e => {
                                setPageSize(Number(e.target.value));
                                setPage(1);
                            }}
                            className="border border-blue-gray rounded px-2 py-1 text-navy-dark outline-none focus:ring-2 focus:ring-yellow/50"
                        >
                            {PAGE_SIZE_OPTIONS.map(n => (
                                <option key={n} value={n}>{n}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-3 py-1.5"
                        >
                            Anterior
                        </Button>
                        <span className="text-sm text-gray px-2">
                            Página {page} de {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-3 py-1.5"
                        >
                            Próxima
                        </Button>
                    </div>
                </div>
            )}

            {modalOpen && (
                <Modal onClose={handleModalClose}>
                    <RegisterFermentationForm onClose={handleModalClose}/>
                </Modal>
            )}

            {editingRecord && (
                <Modal onClose={() => { setEditingRecord(null); fetchRecords(); }}>
                    <EditFermentationRecordForm
                        record={editingRecord}
                        onClose={() => { setEditingRecord(null); fetchRecords(); }}
                    />
                </Modal>
            )}

            {viewingRecord && (
                <Modal onClose={() => setViewingRecord(null)}>
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-navy-dark mb-1">Lote {viewingRecord.batchNumber}</h2>
                        <p className="text-sm text-gray mb-6">{formatDate(viewingRecord.recordedAt)}</p>

                        <div className="text-sm">
                            <DetailRow label="Temperatura" value={`${formatDecimal(viewingRecord.temperature)} °C`}/>
                            <DetailRow label="pH" value={formatDecimal(viewingRecord.ph)}/>
                            <DetailRow label="Extrato" value={formatDecimal(viewingRecord.extract)}/>
                            <DetailRow label="Status" value={<StatusBadge status={viewingRecord.status}/>}/>
                        </div>

                        <div className="mt-5 border-t border-light-gray pt-4">
                            <p className="text-sm font-medium text-navy-dark">Observações</p>
                            <p className="mt-1 text-sm text-gray whitespace-pre-wrap">{viewingRecord.notes || '—'}</p>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}

function DetailRow({label, value}: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between gap-4 border-b border-light-gray py-3 last:border-0">
            <span className="font-medium text-navy-dark">{label}</span>
            <span className="text-right text-gray">{value}</span>
        </div>
    );
}
