//import data from './data';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DomacaStran from './Stran/DomacaStran';
function App() {
  return (
    <BrowserRouter>
      <div>
        <header>
          <a id="Naslov" href="\">
            WebbShop
          </a>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<DomacaStran />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
