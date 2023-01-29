import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import DomacaStran from './Stran/DomacaStran';
import StranIzdelka from './Stran/StranIzdelka';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';

function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column container-stran">
        <header>
          <Navbar bg="dark" variant="dark">
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand>Webbshop</Navbar.Brand>
              </LinkContainer>
            </Container>
          </Navbar>
        </header>
        <main>
          <Container>
            <Routes>
              <Route path="/izdelek/:alt" element={<StranIzdelka />} />
              <Route path="/" element={<DomacaStran />} />
            </Routes>
          </Container>
        </main>
        <footer>
          <div className="text-center">
            Copyright © 2023 Spletna trgovina WebbShop.
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
