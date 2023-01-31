import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import DomacaStran from './Stran/DomacaStran';
import StranIzdelka from './Stran/StranIzdelka';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext } from 'react';
import { Shramba } from './Shramba';
import StranKosarice from './Stran/StranKosarice';
import PrijavnaStran from './Stran/PrijavnaStran';

function App() {
  const { stanje } = useContext(Shramba);
  const { kosarica } = stanje;

  return (
    <BrowserRouter>
      <div className="d-flex flex-column container-stran">
        <header>
          <Navbar bg="dark" variant="dark">
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand>WebbShop</Navbar.Brand>
              </LinkContainer>
              <Nav className="me-auto">
                <Link to="/kosarica" className="nav-link">
                  Kosarica
                  {kosarica.izdelkiKosarice.length > 0 && (
                    <Badge pill bg="primary">
                      {kosarica.izdelkiKosarice.reduce(
                        (a, c) => a + c.kolicina,
                        0
                      )}
                    </Badge>
                  )}
                </Link>
              </Nav>
            </Container>
          </Navbar>
        </header>
        <main>
          <Container>
            <Routes>
              <Route path="/izdelek/:alt" element={<StranIzdelka />} />
              <Route path="/" element={<DomacaStran />} />
              <Route path="/prijava" element={<PrijavnaStran />} />
              <Route path="/kosarica" element={<StranKosarice />} />
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
