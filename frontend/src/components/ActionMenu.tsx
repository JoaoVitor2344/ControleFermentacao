import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {GearIcon, MoreVerticalIcon, TrashIcon} from './icons';

export default function ActionMenu({label, onEdit, onDelete}: {
    label: string;
    onEdit: () => void;
    onDelete?: () => void;
}) {
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button
                    type="button"
                    aria-label={`Opções para ${label}`}
                    className="inline-flex rounded-lg border border-blue-gray bg-transparent p-2 text-navy-dark transition-colors hover:bg-light-gray focus:outline-none focus:ring-2 focus:ring-yellow/50"
                >
                    <MoreVerticalIcon className="w-4 h-4"/>
                </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    align="end"
                    sideOffset={6}
                    className="z-[65] min-w-32 rounded-lg border border-light-gray bg-white p-1 shadow-lg"
                >
                    <DropdownMenu.Item
                        onSelect={onEdit}
                        className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-navy-dark outline-none hover:bg-light-gray focus:bg-light-gray"
                    >
                        <GearIcon className="w-4 h-4"/> Editar
                    </DropdownMenu.Item>
                    {onDelete && (
                        <DropdownMenu.Item
                            onSelect={onDelete}
                            className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-red outline-none hover:bg-red/10 focus:bg-red/10"
                        >
                            <TrashIcon className="w-4 h-4"/> Remover
                        </DropdownMenu.Item>
                    )}
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
}
