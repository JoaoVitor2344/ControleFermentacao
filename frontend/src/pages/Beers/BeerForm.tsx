import {useEffect} from "react";
import {useForm} from "react-hook-form";
import {createBeer, getBeerById, updateBeer} from "../../api/beers.ts";
import Input from "../../components/Input.tsx";
import Button from "../../components/Button.tsx";
import {formatDecimal, parseDecimal} from "../../utils/format.ts";

interface BeerFormData {
    name: string;
    style: string;
    minTemperature: string;
    maxTemperature: string;
    minPh: string;
    maxPh: string;
    minExtract: string;
    maxExtract: string;
}

export default function BeerForm({id, onClose}: { id?: string; onClose: () => void }) {
    const isEditing = !!id;

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitting},
    } = useForm<BeerFormData>();

    useEffect(() => {
        if (isEditing) {
            getBeerById(id).then(beer => reset({
                name: beer.name,
                style: beer.style,
                minTemperature: formatDecimal(beer.minTemperature),
                maxTemperature: formatDecimal(beer.maxTemperature),
                minPh: formatDecimal(beer.minPh),
                maxPh: formatDecimal(beer.maxPh),
                minExtract: formatDecimal(beer.minExtract),
                maxExtract: formatDecimal(beer.maxExtract),
            }));
        }
    }, [id]);

    async function onSubmit(data: BeerFormData) {
        const payload = {
            name: data.name,
            style: data.style,
            minTemperature: parseDecimal(data.minTemperature),
            maxTemperature: parseDecimal(data.maxTemperature),
            minPh: parseDecimal(data.minPh),
            maxPh: parseDecimal(data.maxPh),
            minExtract: parseDecimal(data.minExtract),
            maxExtract: parseDecimal(data.maxExtract),
        };

        if (isEditing) {
            await updateBeer(id, payload);
        } else {
            await createBeer(payload);
        }

        onClose();
    }

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold text-navy-dark mb-6">
                {isEditing ? 'Editar Cerveja' : 'Nova Cerveja'}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                        label="Nome"
                        error={errors.name?.message}
                        {...register('name', {required: 'Nome é obrigatório'})}
                    />
                    <Input
                        label="Estilo"
                        error={errors.style?.message}
                        {...register('style', {required: 'Estilo é obrigatório'})}
                    />
                </div>

                <p className="text-sm font-semibold text-navy-dark pt-2">Parâmetros Aceitáveis</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Temp. Mínima (°C)" inputMode="decimal" placeholder="Ex: 18,0"
                           error={errors.minTemperature?.message}
                           {...register('minTemperature', {required: 'Obrigatório'})}
                    />
                    <Input label="Temp. Máxima (°C)" inputMode="decimal" placeholder="Ex: 22,0"
                           error={errors.maxTemperature?.message}
                           {...register('maxTemperature', {required: 'Obrigatório'})}
                    />
                    <Input label="pH Mínimo" inputMode="decimal" placeholder="Ex: 4,0"
                           error={errors.minPh?.message}
                           {...register('minPh', {required: 'Obrigatório'})}
                    />
                    <Input label="pH Máximo" inputMode="decimal" placeholder="Ex: 4,5"
                           error={errors.maxPh?.message}
                           {...register('maxPh', {required: 'Obrigatório'})}
                    />
                    <Input label="Extrato Mínimo" inputMode="decimal" placeholder="Ex: 10,0"
                           error={errors.minExtract?.message}
                           {...register('minExtract', {required: 'Obrigatório'})}
                    />
                    <Input label="Extrato Máximo" inputMode="decimal" placeholder="Ex: 14,0"
                           error={errors.maxExtract?.message}
                           {...register('maxExtract', {required: 'Obrigatório'})}
                    />
                </div>

                <div className="flex gap-3 pt-2">
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Salvando...' : 'Salvar'}
                    </Button>
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancelar
                    </Button>
                </div>
            </form>
        </div>
    );
}
