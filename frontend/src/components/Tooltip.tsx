import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import type {ReactElement, ReactNode} from 'react';

export function TooltipProvider({children}: { children: ReactNode }) {
    return <TooltipPrimitive.Provider delayDuration={300}>{children}</TooltipPrimitive.Provider>;
}

export default function Tooltip({content, children}: { content: string; children: ReactElement }) {
    return (
        <TooltipPrimitive.Root>
            <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
            <TooltipPrimitive.Portal>
                <TooltipPrimitive.Content
                    side="top"
                    sideOffset={8}
                    className="z-[60] rounded-md bg-navy-dark px-2.5 py-1.5 text-xs font-medium text-white shadow-lg"
                >
                    {content}
                    <TooltipPrimitive.Arrow className="fill-navy-dark"/>
                </TooltipPrimitive.Content>
            </TooltipPrimitive.Portal>
        </TooltipPrimitive.Root>
    );
}
