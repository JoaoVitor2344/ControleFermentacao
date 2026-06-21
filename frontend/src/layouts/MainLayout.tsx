import {NavLink, Outlet} from 'react-router-dom';

export default function MainLayout() {
    return (
        <div className="flex h-screen bg-light-gray font-sans">

            {/* ===== SIDEBAR ===== */}
            <aside className="w-64 bg-navy flex flex-col">

                {/* Logo */}
                <div className="p-6 border-b border-blue-gray/30">
                    <span className="text-yellow font-bold text-xl tracking-wide">ArBrain</span>
                    <p className="text-blue-gray text-xs mt-1">Controle de Fermentação</p>
                </div>

                {/* Links de navegação */}
                <nav className="flex-1 p-4 space-y-1">
                    <NavItem to="/" label="Dashboard"/>
                    <NavItem to="/cervejas" label="Cervejas"/>
                    <NavItem to="/tanques" label="Tanques"/>
                    <NavItem to="/fermentacao/registrar" label="Registrar Fermentação"/>
                    <NavItem to="/fermentacao/lotes" label="Histórico de Lotes"/>
                </nav>
            </aside>

            {/* ===== CONTEÚDO PRINCIPAL ===== */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Header */}
                <header className="bg-white border-b border-light-gray px-8 py-4">
                    <h1 className="text-navy-dark font-semibold text-lg">
                        Controle de Fermentação Cervejeira
                    </h1>
                </header>

                {/* Área de conteúdo — aqui cada página é renderizada */}
                <main className="flex-1 overflow-auto p-8">
                    <Outlet/>
                </main>
            </div>

        </div>
    );
}

// Componente auxiliar para cada item do menu
// "end" no NavLink da rota "/" evita que ela fique ativa em todas as rotas
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
