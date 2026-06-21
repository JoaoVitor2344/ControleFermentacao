import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useNavigate} from 'react-router-dom';
import {getBeers} from '../../api/beers';
import {registerFermentation} from '../../api/fermentation';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Select from '../../components/Select';
import type {Beer, Tank} from "../../types";
import {getTanks} from "../../api/api.ts";

interface FormData {
    beerId: string;
    tankId: string;
    batchNumber: string;
    temperature: number;
    ph: number;
    extract: number;
    notes: string;
}

export default function RegisterFermentation() {
    const [beers, setBeers] = useState<Beer[]>([]);
    const [tanks, setTanks] = useState<Tank[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm<FormData>();

    // Carrega cervejas e tanques em paralelo antes de exibir o formulário
    useEffect(() => {
        Promise.all([getBeers(), getTanks()])
            .then(([beersData, tanksData]) => {
                setBeers(beersData);
                setTanks(tanksData);
            })
            .finally(() => setLoading(false));
    }, []);

    async function onSubmit(data: FormData) {
        await registerFermentation({
            ...data,
            temperature: Number(data.temperature),
            ph: Number(data.ph),
            extract: Number(data.extract),
        });
        navigate('/fermentacao/lotes');
    }

    if (loading) return <p className="text-gray">Carregando...</p>;

    return (
        <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-navy-dark mb-6">Registrar Fermentação</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl p-6 shadow-sm space-y-4">

                {/* Cerveja e Tanque */}
                <div className="grid grid-cols-2 gap-4">
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

                {/* Número do lote */}
                <Input
                    label="Número do Lote"
                    placeholder="Ex: IPA001"
                    error={errors.batchNumber?.message}
                    {...register('batchNumber', {required: 'Número do lote é obrigatório'})}
                />

                {/* Parâmetros medidos */}
                <p className="text-sm font-semibold text-navy-dark pt-2">Parâmetros Medidos</p>

                <div className="grid grid-cols-3 gap-4">
                    <Input
                        label="Temperatura (°C)"
                        type="number"
                        step="0.01"
                        error={errors.temperature?.message}
                        {...register('temperature', {required: 'Obrigatório'})}
                    />
                    <Input
                        label="pH"
                        type="number"
                        step="0.01"
                        error={errors.ph?.message}
                        {...register('ph', {required: 'Obrigatório'})}
                    />
                    <Input
                        label="Extrato"
                        type="number"
                        step="0.01"
                        error={errors.extract?.message}
                        {...register('extract', {required: 'Obrigatório'})}
                    />
                </div>

                {/* Observações */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-navy-dark">Observações</label>
                    <textarea
                        className="border border-blue-gray rounded-lg px-3 py-2 text-sm outline-none focus:ring-2
  focus:ring-yellow/50 resize-none"
                        rows={3}
                        placeholder="Observações opcionais..."
                        {...register('notes')}
                    />
                </div>

                <div className="flex gap-3 pt-2">
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Registrando...' : 'Registrar'}
                    </Button>
                    <Button type="button" variant="secondary" onClick={() => navigate('/')}>
                        Cancelar
                    </Button>
                </div>
            </form>
        </div>
    );
}