import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import DomacaStran from './Stran/DomacaStran';
import StranIzdelka from './Stran/StranIzdelka';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext } from 'react';
import { Shramba } from './Shramba';
import StranKosarice from './Stran/StranKosarice';
import PrijavnaStran from './Stran/PrijavnaStran';
import StranDostave from './Stran/StranDostave';
import RegistracijaStran from './Stran/RegistracijaStran';
import StranPlacila from './Stran/StranPlacila';
import OddajNarociloStran from './Stran/OddajNarociloStran';
import NarociloStran from './Stran/NarociloStran';
import ZgodovinaNarocil from './Stran/ZgodovinaNarocil';

function App() {
  const { stanje, nalozi: ctxNalozi } = useContext(Shramba);
  const { kosarica, podatkiUporabnika } = stanje;

  const odjavaHandler = () => {
    ctxNalozi({ tip: 'UPORABNIK_ODJAVA' });
    localStorage.removeItem('podatkiUporabnika');
    localStorage.removeItem('dostava');
    localStorage.removeItem('nacinPlacila');
  };

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
              <Nav>
                {podatkiUporabnika ? (
                  <NavDropdown
                    title={podatkiUporabnika.imeUporabnika}
                    id="collasible-nav-dropdown"
                  >
                    <LinkContainer to="/racun">
                      <NavDropdown.Item>Uporabniški račun</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/narocila">
                      <NavDropdown.Item>Naročila</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider />
                    <Link
                      className="dropdown-item"
                      to="#odjava"
                      onClick={odjavaHandler}
                    >
                      Odjava
                    </Link>
                  </NavDropdown>
                ) : (
                  <Link className="nav-link" to="/prijava">
                    Prijava
                  </Link>
                )}
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
              <Route path="/registracija" element={<RegistracijaStran />} />
              <Route path="/dostava" element={<StranDostave />} />
              <Route path="/placilo" element={<StranPlacila />} />
              <Route path="/oddajNarocilo" element={<OddajNarociloStran />} />
              <Route path="/narocilo/:id" element={<NarociloStran />} />
              <Route path="/narocila" element={<ZgodovinaNarocil />} />
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
