import {useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {createTank, getTankById, updateTank} from '../../api/api';
import Button from '../../components/Button';
import Input from '../../components/Input';
import {formatDecimal, parseDecimal} from '../../utils/format';

interface TankFormData {
    name: string;
    capacityLiters: string;
}

export default function TankForm({id, onClose}: { id?: string; onClose: () => void }) {
    const isEditing = !!id;

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitting},
    } = useForm<TankFormData>();

    useEffect(() => {
        if (isEditing) {
            getTankById(id).then(tank => reset({
                name: tank.name,
                capacityLiters: formatDecimal(tank.capacityLiters),
            }));
        }
    }, [id]);

    async function onSubmit(data: TankFormData) {
        const payload = {
            name: data.name,
            capacityLiters: parseDecimal(data.capacityLiters),
        };

        if (isEditing) {
            await updateTank(id, payload);
        } else {
            await createTank(payload);
        }

        onClose();
    }

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold text-navy-dark mb-6">
                {isEditing ? 'Editar Tanque' : 'Novo Tanque'}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    label="Nome"
                    error={errors.name?.message}
                    {...register('name', {required: 'Nome é obrigatório'})}
                />
                <Input
                    label="Capacidade (Litros)"
                    inputMode="decimal"
                    placeholder="Ex: 500,0"
                    error={errors.capacityLiters?.message}
                    {...register('capacityLiters', {required: 'Capacidade é obrigatória'})}
                />

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
