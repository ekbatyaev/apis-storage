import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home/Home';

// Компонент для определения текущей страницы
const PageHandler = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Определяем, какая страница должна отображаться
    const path = location.pathname;
    
    if (path.includes('places')) {
      // Загружаем содержимое places.html
      console.log('Loading places page');
    }
    // и т.д.
  }, [location]);
  
  return null;
};

function App() {
  return (
    <Router basename="/apis-storage">
      <PageHandler />
      <Routes>
        <Route path="/*" element={<Home />} />
        {/* Все остальные пути также ведут на Home */}
        <Route path="/places" element={<Home />} />
        <Route path="/stories" element={<Home />} />
        {/* и т.д. */}
      </Routes>
    </Router>
  );
}

export default App;
