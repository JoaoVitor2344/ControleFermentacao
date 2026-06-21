import {BrowserRouter, Routes, Route} from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import BeerList from './pages/Beers';
import BeerForm from './pages/Beers/BeerForm';
import TankList from './pages/Tanks';
import TankForm from './pages/Tanks/TankForm';
import RegisterFermentation from './pages/Fermentation/RegisterFermentation';
import BatchHistory from './pages/Fermentation/BatchHistory';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout/>}>
                    <Route path="/" element={<Dashboard/>}/>
                    <Route path="/cervejas" element={<BeerList/>}/>
                    <Route path="/cervejas/nova" element={<BeerForm/>}/>
                    <Route path="/cervejas/:id/editar" element={<BeerForm/>}/>
                    <Route path="/tanques" element={<TankList/>}/>
                    <Route path="/tanques/novo" element={<TankForm/>}/>
                    <Route path="/tanques/:id/editar" element={<TankForm/>}/>
                    <Route path="/fermentacao/registrar" element={<RegisterFermentation/>}/>
                    <Route path="/fermentacao/lotes" element={<BatchHistory/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;