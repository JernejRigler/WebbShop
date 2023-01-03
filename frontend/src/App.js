import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import DomacaStran from './Stran/DomacaStran';
import StranIzdelka from './Stran/StranIzdelka';
function App() {
  return (
    <BrowserRouter>
      <div>
        <header>
          <Link id="Naslov" to="/">
            WebbShop
          </Link>
        </header>
        <main>
          <Routes>
            <Route path="/izdelek/:alt" element={<StranIzdelka />} />
            <Route path="/" element={<DomacaStran />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
