import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/places" element={<Home />} />
        <Route path="/pictures" element={<Home />} />
        <Route path="/anime" element={<Home />} />
        <Route path="/top" element={<Home />} />
        <Route path="/top/:id" element={<Home />} />
        <Route path="/*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
