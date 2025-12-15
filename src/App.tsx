import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Anime from './pages/Anime/Anime';
import Pictures from './pages/Pictures/Pictures';
import Places from './pages/Places/Places';


export default function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Anime" element={<Anime />} />
                <Route path="/Pictures" element={<Pictures />} />
                <Route path="/Places" element={<Places />} />
            </Routes>
        </HashRouter>
    );
}