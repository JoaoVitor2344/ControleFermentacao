import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {getBeers} from '../../api/beers';
import {getTanks} from '../../api/api';
import {registerFermentation, getAllBatches} from '../../api/fermentation';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Select from '../../components/Select';
import type {Beer, Tank} from '../../types';
import {parseDecimal} from '../../utils/format';

interface FormData {
    beerId: string;
    tankId: string;
    batchNumber: string;
    temperature: string;
    ph: string;
    extract: string;
    notes: string;
}

export default function RegisterFermentationForm({onClose}: { onClose: () => void }) {
    const [beers, setBeers] = useState<Beer[]>([]);
    const [tanks, setTanks] = useState<Tank[]>([]);
    const [batches, setBatches] = useState<string[]>([]);
    const [loadingOptions, setLoadingOptions] = useState(true);

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm<FormData>();

    useEffect(() => {
        Promise.all([getBeers(), getTanks(), getAllBatches()])
            .then(([beersData, tanksData, batchesData]) => {
                setBeers(beersData);
                setTanks(tanksData);
                setBatches(batchesData);
            })
            .finally(() => setLoadingOptions(false));
    }, []);

    async function onSubmit(data: FormData) {
        await registerFermentation({
            ...data,
            temperature: parseDecimal(data.temperature),
            ph: parseDecimal(data.ph),
            extract: parseDecimal(data.extract),
        });
        onClose();
    }

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold text-navy-dark mb-6">Registrar Apontamento</h2>

            {loadingOptions ? (
                <div className="min-h-24" aria-hidden="true"/>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Select
                            label="Cerveja"
                            error={errors.beerId?.message}
                            {...register('beerId', {required: 'Selecione uma cerveja'})}
                        >
                            <option value="">Selecione...</option>
                            {beers.map(beer => (
                                <option key={beer.id} value={beer.id}>{beer.name}</option>
                            ))}
                        </Select>

                        <Select
                            label="Tanque"
                            error={errors.tankId?.message}
                            {...register('tankId', {required: 'Selecione um tanque'})}
                        >
                            <option value="">Selecione...</option>
                            {tanks.map(tank => (
                                <option key={tank.id} value={tank.id}>{tank.name}</option>
                            ))}
                        </Select>
                    </div>

                    <Select
                        label="Número do Lote"
                        error={errors.batchNumber?.message}
                        {...register('batchNumber', {required: 'Selecione um lote'})}
                    >
                        <option value="">Selecione...</option>
                        {batches.map(b => (
                            <option key={b} value={b}>{b}</option>
                        ))}
                    </Select>

                    <p className="text-sm font-semibold text-navy-dark pt-2">Parâmetros Medidos</p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Input
                            label="Temperatura (°C)"
                            inputMode="decimal"
                            placeholder="Ex: 20,5"
                            error={errors.temperature?.message}
                            {...register('temperature', {required: 'Obrigatório'})}
                        />
                        <Input
                            label="pH"
                            inputMode="decimal"
                            placeholder="Ex: 4,2"
                            error={errors.ph?.message}
                            {...register('ph', {required: 'Obrigatório'})}
                        />
                        <Input
                            label="Extrato"
                            inputMode="decimal"
                            placeholder="Ex: 12,0"
                            error={errors.extract?.message}
                            {...register('extract', {required: 'Obrigatório'})}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-navy-dark">Observações</label>
                        <textarea
                            className="border border-blue-gray rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-yellow/50 resize-none"
                            rows={3}
                            placeholder="Observações opcionais..."
                            {...register('notes')}
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Registrando...' : 'Registrar'}
                        </Button>
                        <Button type="button" variant="secondary" onClick={onClose}>
                            Cancelar
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}
