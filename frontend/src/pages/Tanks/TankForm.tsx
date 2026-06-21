import Button from "../../components/Button.tsx";
import type {Tank} from "../../types";
import {useNavigate, useParams} from "react-router-dom";
import {useForm} from "react-hook-form";
import {useEffect} from "react";
import {createTank, getTankById, updateTank} from "../../api/api.ts";
import Input from "../../components/Input.tsx";

type TankFormData = Omit<Tank, 'id'>;

export default function TankForm() {
    const {id} = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitting},
    } = useForm<TankFormData>();

    useEffect(() => {
        if (isEditing) {
            getTankById(id).then(tank => reset(tank));
        }
    }, [id]);

    async function onSubmit(data: TankFormData) {
        const payload = {
            ...data,
            capacityLiters: Number(data.capacityLiters),
        };

        if (isEditing) {
            await updateTank(id, payload);
        } else {
            await createTank(payload);
        }

        navigate('/tanques');
    }

    return (
        <div className="max-w-md">
            <h2 className="text-2xl font-bold text-navy-dark mb-6">
                {isEditing ? 'Editar Tanque' : 'Novo Tanque'}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl p-6 shadow-sm space-y-4">
                <Input
                    label="Nome"
                    error={errors.name?.message}
                    {...register('name', {required: 'Nome é obrigatório'})}
                />
                <Input
                    label="Capacidade (Litros)"
                    type="number"
                    step="0.01"
                    error={errors.capacityLiters?.message}
                    {...register('capacityLiters', {required: 'Capacidade é obrigatória'})}
                />

                <div className="flex gap-3 pt-2">
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Salvando...' : 'Salvar'}
                    </Button>
                    <Button type="button" variant="secondary" onClick={() => navigate('/tanques')}>
                        Cancelar
                    </Button>
                </div>
            </form>
        </div>
    );
}