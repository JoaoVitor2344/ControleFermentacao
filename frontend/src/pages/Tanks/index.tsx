import {useEffect, useState} from 'react';
import type {Tank} from '../../types';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import TankForm from './TankForm';
import {deleteTank, getTanks} from '../../api/api';
import {formatDecimal} from '../../utils/format';
import {AnimatePresence, motion} from "framer-motion";
import {EyeIcon, EyeOffIcon, GearIcon, PlusIcon, TrashIcon} from '../../components/icons';
import Tooltip from '../../components/Tooltip';
import Input from '../../components/Input';
import SearchIcon from '../../components/SearchIcon';
import {parseDecimal} from '../../utils/format';
import ActionMenu from '../../components/ActionMenu';

export default function TankList() {
    const [tanks, setTanks] = useState<Tank[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDeleted, setShowDeleted] = useState(false);
    const [filterName, setFilterName] = useState('');
    const [filterMinCapacity, setFilterMinCapacity] = useState('');
    const [filterMaxCapacity, setFilterMaxCapacity] = useState('');
    const [appliedName, setAppliedName] = useState('');
    const [appliedMinCapacity, setAppliedMinCapacity] = useState<number | undefined>();
    const [appliedMaxCapacity, setAppliedMaxCapacity] = useState<number | undefined>();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | undefined>(undefined);
    const [viewingTank, setViewingTank] = useState<Tank | null>(null);
    const isFiltered = Boolean(appliedName || appliedMinCapacity !== undefined || appliedMaxCapacity !== undefined);

    useEffect(() => {
        fetchTanks();
    }, [showDeleted, appliedName, appliedMinCapacity, appliedMaxCapacity]);

    function fetchTanks() {
        setLoading(true);
        getTanks(showDeleted, {
            name: appliedName || undefined,
            minCapacityLiters: appliedMinCapacity,
            maxCapacityLiters: appliedMaxCapacity,
        })
            .then(data => setTanks(data))
            .finally(() => setLoading(false));
    }

    function openCreate() {
        setEditingId(undefined);
        setModalOpen(true);
    }

    function openEdit(id: string) {
        setEditingId(id);
        setModalOpen(true);
    }

    function handleModalClose() {
        setModalOpen(false);
        fetchTanks();
    }

    function handleDelete(id: string) {
        if (!confirm('Deseja remover este tanque?')) return;
        deleteTank(id).then(() => fetchTanks());
    }

    function handleSearch() {
        setAppliedName(filterName.trim());
        setAppliedMinCapacity(filterMinCapacity.trim() ? parseDecimal(filterMinCapacity) : undefined);
        setAppliedMaxCapacity(filterMaxCapacity.trim() ? parseDecimal(filterMaxCapacity) : undefined);
    }

    function clearFilters() {
        setFilterName('');
        setFilterMinCapacity('');
        setFilterMaxCapacity('');
        setAppliedName('');
        setAppliedMinCapacity(undefined);
        setAppliedMaxCapacity(undefined);
    }

    if (loading) return null;

    return (
        <div>
            <div className="mb-6">
                <div className="flex items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold text-navy-dark">Tanques</h2>
                    <Tooltip content="Novo Tanque">
                        <Button onClick={openCreate} aria-label="Novo Tanque">
                            <PlusIcon className="w-4 h-4"/>
                        </Button>
                    </Tooltip>
                </div>
                <div className="mt-3 flex sm:justify-end">
                    <button
                        type="button"
                        aria-pressed={showDeleted}
                        onClick={() => setShowDeleted(value => !value)}
                        className="flex items-center gap-2 text-sm text-gray cursor-pointer"
                    >
                        {showDeleted ? <EyeIcon className="w-4 h-4"/> : <EyeOffIcon className="w-4 h-4"/>}
                        {showDeleted ? 'Ocultar removidos' : 'Mostrar removidos'}
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="space-y-4">
                    <Input
                        label="Nome"
                        placeholder="Buscar por nome"
                        value={filterName}
                        onChange={event => setFilterName(event.target.value)}
                        onKeyDown={event => { if (event.key === 'Enter') handleSearch(); }}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            label="Capacidade mínima (L)"
                            inputMode="decimal"
                            placeholder="Ex: 500,0"
                            value={filterMinCapacity}
                            onChange={event => setFilterMinCapacity(event.target.value)}
                            onKeyDown={event => { if (event.key === 'Enter') handleSearch(); }}
                        />
                        <Input
                            label="Capacidade máxima (L)"
                            inputMode="decimal"
                            placeholder="Ex: 1000,0"
                            value={filterMaxCapacity}
                            onChange={event => setFilterMaxCapacity(event.target.value)}
                            onKeyDown={event => { if (event.key === 'Enter') handleSearch(); }}
                        />
                    </div>
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

            {tanks.length === 0 ? (
                <p className="text-gray">Nenhum tanque cadastrado.</p>
            ) : (
                <>
                    {/* Lista mobile (< sm) */}
                    <div className="sm:hidden bg-white rounded-xl shadow-sm divide-y divide-light-gray">
                        <AnimatePresence>
                            {tanks.map(tank => (
                                <motion.div
                                    key={tank.id}
                                    initial={{opacity: 0, y: -6}}
                                    animate={{opacity: 1, y: 0}}
                                    exit={{opacity: 0, x: -16}}
                                    transition={{duration: 0.18}}
                                    className={`px-4 py-3 ${tank.deletedAt ? 'opacity-50' : ''}`}
                                >
                                    <p className="font-medium text-navy-dark mb-2">
                                        {tank.name}
                                        {tank.deletedAt && (
                                            <span className="ml-2 text-xs bg-red/20 text-red px-2 py-0.5 rounded-full">
                                                Removido
                                            </span>
                                        )}
                                    </p>
                                    <div className="flex gap-2 flex-wrap">
                                        <Button variant="view" onClick={() => setViewingTank(tank)}>
                                            <EyeIcon className="w-4 h-4"/> Visualizar
                                        </Button>
                                        {!tank.deletedAt && (
                                            <ActionMenu
                                                label={tank.name}
                                                onEdit={() => openEdit(tank.id)}
                                                onDelete={() => handleDelete(tank.id)}
                                            />
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Tabela desktop (sm+) */}
                    <div className="hidden sm:block bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-light-gray text-navy-dark font-semibold">
                                <tr>
                                    <th className="text-left px-6 py-3">Nome</th>
                                    <th className="text-left px-6 py-3">Capacidade (L)</th>
                                    <th className="px-6 py-3"></th>
                                </tr>
                                </thead>
                                <tbody>
                                <AnimatePresence>
                                    {tanks.map(tank => (
                                        <motion.tr
                                            key={tank.id}
                                            initial={{opacity: 0, y: -6}}
                                            animate={{opacity: 1, y: 0}}
                                            exit={{opacity: 0, x: -16}}
                                            transition={{duration: 0.18}}
                                            className={`border-t border-light-gray ${tank.deletedAt ? 'opacity-50' : ''}`}
                                        >
                                            <td className="px-6 py-4 font-medium text-navy-dark">
                                                {tank.name}
                                                {tank.deletedAt && (
                                                    <span
                                                        className="ml-2 text-xs bg-red/20 text-red px-2 py-0.5 rounded-full">
                                                        Removido
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-gray">
                                                {formatDecimal(tank.capacityLiters)} L
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2 justify-end">
                                                    {!tank.deletedAt && (
                                                        <>
                                                            <Tooltip content="Editar">
                                                                <Button variant="outline"
                                                                        onClick={() => openEdit(tank.id)} aria-label="Editar">
                                                                    <GearIcon className="w-4 h-4"/>
                                                                </Button>
                                                            </Tooltip>
                                                            <Tooltip content="Remover">
                                                                <Button variant="outlineDanger"
                                                                        onClick={() => handleDelete(tank.id)} aria-label="Remover">
                                                                    <TrashIcon className="w-4 h-4"/>
                                                                </Button>
                                                            </Tooltip>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* Modal de edição/criação */}
            {modalOpen && (
                <Modal onClose={handleModalClose}>
                    <TankForm id={editingId} onClose={handleModalClose}/>
                </Modal>
            )}

            {/* Modal de detalhe (mobile) */}
            {viewingTank && (
                <Modal onClose={() => setViewingTank(null)}>
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-navy-dark mb-6">{viewingTank.name}</h2>

                        <div className="text-sm">
                            <DetailRow
                                label="Capacidade"
                                value={`${formatDecimal(viewingTank.capacityLiters)} L`}
                            />
                        </div>

                        {!viewingTank.deletedAt && (
                            <div className="flex gap-3 mt-6 pt-4 border-t border-light-gray">
                                <Button
                                    variant="edit"
                                    onClick={() => {
                                        setViewingTank(null);
                                        openEdit(viewingTank.id);
                                    }}
                                >
                                    <GearIcon className="w-4 h-4"/> Editar
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => {
                                        setViewingTank(null);
                                        handleDelete(viewingTank.id);
                                    }}
                                >
                                    <TrashIcon className="w-4 h-4"/> Remover
                                </Button>
                            </div>
                        )}
                    </div>
                </Modal>
            )}
        </div>
    );
}

function DetailRow({label, value}: { label: string; value: string }) {
    return (
        <div className="flex justify-between items-center py-3 border-b border-light-gray last:border-0">
            <span className="font-medium text-navy-dark">{label}</span>
            <span className="text-gray">{value}</span>
        </div>
    );
}
