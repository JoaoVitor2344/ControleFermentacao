import {useEffect, useState} from "react";
import type {Beer} from "../../types";
import {deleteBeer, getBeers} from "../../api/beers.ts";
import Button from "../../components/Button.tsx";
import {formatDecimal} from "../../utils/format.ts";
import Modal from "../../components/Modal.tsx";
import BeerForm from "./BeerForm.tsx";
import {AnimatePresence, motion} from "framer-motion";
import {EyeIcon, EyeOffIcon, GearIcon, PlusIcon, TrashIcon} from "../../components/icons.tsx";
import Tooltip from '../../components/Tooltip';
import Input from '../../components/Input';
import SearchIcon from '../../components/SearchIcon';
import ActionMenu from '../../components/ActionMenu';

export default function BeerList() {
    const [beers, setBeers] = useState<Beer[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDeleted, setShowDeleted] = useState(false);
    const [filterName, setFilterName] = useState('');
    const [filterStyle, setFilterStyle] = useState('');
    const [appliedName, setAppliedName] = useState('');
    const [appliedStyle, setAppliedStyle] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | undefined>(undefined);
    const [viewingBeer, setViewingBeer] = useState<Beer | null>(null);
    const isFiltered = Boolean(appliedName || appliedStyle);

    useEffect(() => {
        fetchBeers();
    }, [showDeleted, appliedName, appliedStyle]);

    function fetchBeers() {
        setLoading(true);
        getBeers(showDeleted, {
            name: appliedName || undefined,
            style: appliedStyle || undefined,
        })
            .then(data => setBeers(data))
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
        fetchBeers();
    }

    function handleDelete(id: string) {
        if (!confirm('Deseja remover esta cerveja?')) return;
        deleteBeer(id).then(() => fetchBeers());
    }

    function handleSearch() {
        setAppliedName(filterName.trim());
        setAppliedStyle(filterStyle.trim());
    }

    function clearFilters() {
        setFilterName('');
        setFilterStyle('');
        setAppliedName('');
        setAppliedStyle('');
    }

    if (loading) return null;

    return (
        <div>
            <div className="mb-6">
                <div className="flex items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold text-navy-dark">Cervejas</h2>
                    <Tooltip content="Nova Cerveja">
                        <Button onClick={openCreate} aria-label="Nova Cerveja">
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
                        {showDeleted ? 'Ocultar removidas' : 'Mostrar removidas'}
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] gap-4 items-end">
                    <Input
                        label="Nome"
                        placeholder="Buscar por nome"
                        value={filterName}
                        onChange={event => setFilterName(event.target.value)}
                        onKeyDown={event => { if (event.key === 'Enter') handleSearch(); }}
                    />
                    <Input
                        label="Estilo"
                        placeholder="Buscar por estilo"
                        value={filterStyle}
                        onChange={event => setFilterStyle(event.target.value)}
                        onKeyDown={event => { if (event.key === 'Enter') handleSearch(); }}
                    />
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

            {beers.length === 0 ? (
                <p className="text-gray">Nenhuma cerveja cadastrada.</p>
            ) : (
                <>
                    {/* Lista mobile (< sm) */}
                    <div className="sm:hidden bg-white rounded-xl shadow-sm divide-y divide-light-gray">
                        <AnimatePresence>
                            {beers.map(beer => (
                                <motion.div
                                    key={beer.id}
                                    initial={{opacity: 0, y: -6}}
                                    animate={{opacity: 1, y: 0}}
                                    exit={{opacity: 0, x: -16}}
                                    transition={{duration: 0.18}}
                                    className={`px-4 py-3 ${beer.deletedAt ? 'opacity-50' : ''}`}
                                >
                                    <p className="font-medium text-navy-dark mb-2">
                                        {beer.name}
                                        {beer.deletedAt && (
                                            <span className="ml-2 text-xs bg-red/20 text-red px-2 py-0.5 rounded-full">
                                                Removida
                                            </span>
                                        )}
                                    </p>
                                    <div className="flex gap-2 flex-wrap">
                                        <Button variant="view" onClick={() => setViewingBeer(beer)}>
                                            <EyeIcon className="w-4 h-4"/> Visualizar
                                        </Button>
                                        {!beer.deletedAt && (
                                            <ActionMenu
                                                label={beer.name}
                                                onEdit={() => openEdit(beer.id)}
                                                onDelete={() => handleDelete(beer.id)}
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
                                    <th className="text-left px-6 py-3">Estilo</th>
                                    <th className="text-left px-6 py-3">Temp. (°C)</th>
                                    <th className="text-left px-6 py-3">pH</th>
                                    <th className="text-left px-6 py-3">Extrato</th>
                                    <th className="px-6 py-3"></th>
                                </tr>
                                </thead>
                                <tbody>
                                <AnimatePresence>
                                    {beers.map(beer => (
                                        <motion.tr
                                            key={beer.id}
                                            initial={{opacity: 0, y: -6}}
                                            animate={{opacity: 1, y: 0}}
                                            exit={{opacity: 0, x: -16}}
                                            transition={{duration: 0.18}}
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
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2 justify-end">
                                                    {!beer.deletedAt && (
                                                        <>
                                                            <Tooltip content="Editar">
                                                                <Button variant="outline" onClick={() => openEdit(beer.id)} aria-label="Editar">
                                                                    <GearIcon className="w-4 h-4"/>
                                                                </Button>
                                                            </Tooltip>
                                                            <Tooltip content="Remover">
                                                                <Button variant="outlineDanger" onClick={() => handleDelete(beer.id)} aria-label="Remover">
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
                    <BeerForm id={editingId} onClose={handleModalClose}/>
                </Modal>
            )}

            {/* Modal de detalhe (mobile) */}
            {viewingBeer && (
                <Modal onClose={() => setViewingBeer(null)}>
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-navy-dark mb-1">{viewingBeer.name}</h2>
                        <p className="text-sm text-gray mb-6">{viewingBeer.style}</p>

                        <div className="text-sm">
                            <DetailRow
                                label="Temperatura"
                                value={`${formatDecimal(viewingBeer.minTemperature)} – ${formatDecimal(viewingBeer.maxTemperature)} °C`}
                            />
                            <DetailRow
                                label="pH"
                                value={`${formatDecimal(viewingBeer.minPh)} – ${formatDecimal(viewingBeer.maxPh)}`}
                            />
                            <DetailRow
                                label="Extrato"
                                value={`${formatDecimal(viewingBeer.minExtract)} – ${formatDecimal(viewingBeer.maxExtract)}`}
                            />
                        </div>

                        {!viewingBeer.deletedAt && (
                            <div className="flex gap-3 mt-6 pt-4 border-t border-light-gray">
                                <Button
                                    variant="edit"
                                    onClick={() => { setViewingBeer(null); openEdit(viewingBeer.id); }}
                                >
                                    <GearIcon className="w-4 h-4"/> Editar
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => { setViewingBeer(null); handleDelete(viewingBeer.id); }}
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
