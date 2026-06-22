import {useSyncExternalStore} from 'react';
import {getApiLoadingSnapshot, subscribeToApiLoading} from '../api/client';

export default function ApiLoader({children}: { children: React.ReactNode }) {
    const isLoading = useSyncExternalStore(
        subscribeToApiLoading,
        getApiLoadingSnapshot,
        getApiLoadingSnapshot,
    );

    return (
        <>
            {children}
            {isLoading && (
                <div
                    className="fixed inset-0 z-[70] flex items-center justify-center bg-navy-dark/20 backdrop-blur-[1px]"
                    role="status"
                    aria-label="Carregando dados"
                >
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-navy border-t-yellow"/>
                    <span className="sr-only">Carregando dados</span>
                </div>
            )}
        </>
    );
}
