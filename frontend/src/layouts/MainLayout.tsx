import {useEffect, useState} from 'react';
import {NavLink, Outlet, useLocation} from 'react-router-dom';

export default function MainLayout() {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    return (
        <div className="flex h-screen bg-light-gray font-sans">

            {/* ===== SIDEBAR ===== */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-navy flex flex-col
                transition-transform duration-300 ease-in-out
                md:relative md:translate-x-0 md:z-auto
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Logo */}
                <div className="p-6 border-b border-blue-gray/30 flex items-center gap-3">
                    <img src="/logo.svg" alt="ArBrain" className="h-9 w-auto flex-shrink-0"/>
                    <p className="text-blue-gray text-xs leading-tight">Controle de Fermentação Cervejeira</p>
                </div>

                {/* Links de navegação */}
                <nav className="flex-1 p-4 space-y-1">
                    <NavItem to="/" label="Dashboard"/>
                    <NavItem to="/cervejas" label="Cervejas"/>
                    <NavItem to="/tanques" label="Tanques"/>
                    <NavItem to="/fermentacao" label="Fermentação"/>
                </nav>
            </aside>

            {/* Overlay escuro ao abrir sidebar em mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ===== CONTEÚDO PRINCIPAL ===== */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">

                {/* Top bar mobile */}
                <div className="md:hidden flex items-center h-14 px-4 bg-navy border-b border-blue-gray/30 flex-shrink-0">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="text-white p-1 rounded"
                        aria-label="Abrir menu"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </button>
                    <img src="/logo.svg" alt="ArBrain" className="h-7 w-auto ml-3"/>
                </div>

                {/* Área de conteúdo */}
                <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
                    <div key={location.key} className="animate-page-enter">
                        <Outlet/>
                    </div>
                </main>
            </div>

        </div>
    );
}

function NavItem({to, label}: { to: string; label: string }) {
    return (
        <NavLink
            to={to}
            end={to === '/'}
            className={({isActive}) =>
                `block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                        ? 'bg-yellow text-navy-dark'
                        : 'text-blue-gray hover:bg-white/10 hover:text-white'
                }`
            }
        >
            {label}
        </NavLink>
    );
}
