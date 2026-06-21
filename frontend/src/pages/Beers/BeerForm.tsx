import {useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {useNavigate, useParams} from 'react-router-dom';
import {createBeer, getBeerById, updateBeer} from '../../api/beers';
import Button from '../../components/Button';
import Input from '../../components/Input';
import type {Beer} from "../../types";

// O id não é preenchido pelo usuário
type BeerFormData = Omit<Beer, 'id'>;

export default function BeerForm() {
    const {id} = useParams(); // existe se for edição, undefined se for criação
    const navigate = useNavigate();
    const isEditing = !!id;

    const {
        register,   // conecta cada input ao formulário
        handleSubmit, // intercepta o submit e valida antes de chamar sua função
        reset,      // preenche o formulário com dados existentes (edição)
        formState: {errors, isSubmitting},
    } = useForm<BeerFormData>();

    // Se for edição, busca os dados da cerveja e preenche o formulário
    useEffect(() => {
        if (isEditing) {
            getBeerById(id).then(beer => reset(beer));
        }
    }, [id]);

    async function onSubmit(data: BeerFormData) {
        // Converte os campos numéricos — inputs HTML sempre retornam string
        const payload = {
            ...data,
            minTemperature: Number(data.minTemperature),
            maxTemperature: Number(data.maxTemperature),
            minPh: Number(data.minPh),
            maxPh: Number(data.maxPh),
            minExtract: Number(data.minExtract),
            maxExtract: Number(data.maxExtract),
        };

        if (isEditing) {
            await updateBeer(id, payload);
        } else {
            await createBeer(payload);
        }

        navigate('/cervejas');
    }

    return (
        <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-navy-dark mb-6">
                {isEditing ? 'Editar Cerveja' : 'Nova Cerveja'}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl p-6 shadow-sm space-y-4">

                <div className="grid grid-cols-2 gap-4">
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

                <div className="grid grid-cols-2 gap-4">
                    <Input label="Temp. Mínima (°C)" type="number" step="0.01"
                           error={errors.minTemperature?.message}
                           {...register('minTemperature', {required: 'Obrigatório'})}
                    />
                    <Input label="Temp. Máxima (°C)" type="number" step="0.01"
                           error={errors.maxTemperature?.message}
                           {...register('maxTemperature', {required: 'Obrigatório'})}
                    />
                    <Input label="pH Mínimo" type="number" step="0.01"
                           error={errors.minPh?.message}
                           {...register('minPh', {required: 'Obrigatório'})}
                    />
                    <Input label="pH Máximo" type="number" step="0.01"
                           error={errors.maxPh?.message}
                           {...register('maxPh', {required: 'Obrigatório'})}
                    />
                    <Input label="Extrato Mínimo" type="number" step="0.01"
                           error={errors.minExtract?.message}
                           {...register('minExtract', {required: 'Obrigatório'})}
                    />
                    <Input label="Extrato Máximo" type="number" step="0.01"
                           error={errors.maxExtract?.message}
                           {...register('maxExtract', {required: 'Obrigatório'})}
                    />
                </div>

                <div className="flex gap-3 pt-2">
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Salvando...' : 'Salvar'}
                    </Button>
                    <Button type="button" variant="secondary" onClick={() => navigate('/cervejas')}>
                        Cancelar
                    </Button>
                </div>

            </form>
        </div>
    );
}