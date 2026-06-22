import {useForm} from 'react-hook-form';
import {updateFermentationRecord} from '../../api/fermentation';
import Button from '../../components/Button';
import Input from '../../components/Input';
import type {FermentationRecord} from '../../types';
import {formatDateTime, formatDecimal, parseDecimal} from '../../utils/format';

interface FormData {
    temperature: string;
    ph: string;
    extract: string;
    notes: string;
}

export default function EditFermentationRecordForm({record, onClose}: {
    record: FermentationRecord;
    onClose: () => void;
}) {
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm<FormData>({
        defaultValues: {
            temperature: formatDecimal(record.temperature),
            ph: formatDecimal(record.ph),
            extract: formatDecimal(record.extract),
            notes: record.notes,
        },
    });

    async function onSubmit(data: FormData) {
        await updateFermentationRecord(record.id, {
            temperature: parseDecimal(data.temperature),
            ph: parseDecimal(data.ph),
            extract: parseDecimal(data.extract),
            notes: data.notes,
        });
        onClose();
    }

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold text-navy-dark mb-1">Editar Apontamento</h2>
            <p className="text-sm text-gray mb-6">
                Lote <strong className="text-navy-dark">{record.batchNumber}</strong>
                {' — '}
                {formatDateTime(record.recordedAt)}
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <p className="text-sm font-semibold text-navy-dark">Parâmetros Medidos</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input
                        label="Temperatura (°C)"
                        inputMode="decimal"
                        error={errors.temperature?.message}
                        {...register('temperature', {required: 'Obrigatório'})}
                    />
                    <Input
                        label="pH"
                        inputMode="decimal"
                        error={errors.ph?.message}
                        {...register('ph', {required: 'Obrigatório'})}
                    />
                    <Input
                        label="Extrato"
                        inputMode="decimal"
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
