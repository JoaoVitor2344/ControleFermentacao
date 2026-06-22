import {BrowserRouter, Routes, Route} from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import BeerList from './pages/Beers';
import TankList from './pages/Tanks';
import Fermentation from './pages/Fermentation';
import {TooltipProvider} from './components/Tooltip';
import ApiLoader from './components/ApiLoader';

function App() {
    return (
        <ApiLoader>
            <TooltipProvider>
                <BrowserRouter>
                    <Routes>
                        <Route element={<MainLayout/>}>
                            <Route path="/" element={<Dashboard/>}/>
                            <Route path="/cervejas" element={<BeerList/>}/>
                            <Route path="/tanques" element={<TankList/>}/>
                            <Route path="/fermentacao" element={<Fermentation/>}/>
                        </Route>
                    </Routes>
                </BrowserRouter>
            </TooltipProvider>
        </ApiLoader>
    );
}

export default App;
