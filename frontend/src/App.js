import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import DomacaStran from './Stran/DomacaStran';
import StranIzdelka from './Stran/StranIzdelka';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { Shramba } from './Shramba';
import StranKosarice from './Stran/StranKosarice';
import PrijavnaStran from './Stran/PrijavnaStran';
import StranDostave from './Stran/StranDostave';
import RegistracijaStran from './Stran/RegistracijaStran';
import StranPlacila from './Stran/StranPlacila';
import OddajNarociloStran from './Stran/OddajNarociloStran';
import NarociloStran from './Stran/NarociloStran';
import ZgodovinaNarocil from './Stran/ZgodovinaNarocil';
import Button from 'react-bootstrap/Button';
import dobiError from './Errorji';
import axios from 'axios';
import IskalnoPolje from './Komponente/IskalnoPolje';
import IsciStran from './Stran/IsciStran';
import ZasciteneUsmeritve from './Komponente/ZasciteneUsmeritve';
import NadzornaPloscaStran from './Stran/NadzornaPloscaStran';
import AdminUsmeritev from './Komponente/AdminUsmeritev';
import StranRacuna from './Stran/StranRacuna';

function App() {
  const { stanje, nalozi: ctxNalozi } = useContext(Shramba);
  const { kosarica, podatkiUporabnika } = stanje;

  const odjavaHandler = () => {
    ctxNalozi({ tip: 'UPORABNIK_ODJAVA' });
    localStorage.removeItem('podatkiUporabnika');
    localStorage.removeItem('dostava');
    localStorage.removeItem('nacinPlacila');
    window.location.href = '/prijava';
  };

  const [stranskaVrsticaOdprta, nastaviStranskaVrsticaOdprta] = useState(false);
  const [kategorije, nastaviKategorije] = useState([]);

  useEffect(() => {
    const dobiKategorije = async () => {
      try {
        const { data } = await axios.get('/api/izdelki/kategorije');
        nastaviKategorije(data);
      } catch (err) {
        alert(dobiError(err));
      }
    };
    dobiKategorije();
  }, []);

  return (
    <BrowserRouter>
      <div
        className={
          stranskaVrsticaOdprta
            ? 'd-flex flex-column site-container active-cont'
            : 'd-flex flex-column site-container'
        }
      >
        <header>
          <Navbar bg="dark" variant="dark">
            <Container>
              <Button
                variant="dark"
                onClick={() =>
                  nastaviStranskaVrsticaOdprta(!stranskaVrsticaOdprta)
                }
              >
                <i class="fa-solid fa-bars"></i>
              </Button>
              <LinkContainer to="/">
                <Navbar.Brand>WebbShop</Navbar.Brand>
              </LinkContainer>
              <Nav className="me-auto">
                <IskalnoPolje />
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
                    {podatkiUporabnika && podatkiUporabnika.praviceAdmina && (
                      <>
                        <NavDropdown.ItemText>
                          <strong>Admin nastavitve</strong>
                        </NavDropdown.ItemText>
                        <LinkContainer to="/admin/nadzornaPlosca">
                          <NavDropdown.Item>Nadzorna plošča</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/admin/nadzorIzdelkov">
                          <NavDropdown.Item>
                            Upravljanje izdelkov
                          </NavDropdown.Item>
                        </LinkContainer>
                        <NavDropdown.Divider />
                      </>
                    )}
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
        <div
          className={
            stranskaVrsticaOdprta
              ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
              : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
          }
        >
          <Nav className="flex-column text-white w-100 p-2">
            <Nav.Item>
              <strong>Kategorije</strong>
            </Nav.Item>
            {kategorije.map((kategorija) => (
              <Nav.Item key={kategorija}>
                <LinkContainer
                  to={{
                    pathname: '/isci',
                    search: `?kategorija=${kategorija}`,
                  }}
                  onClick={() =>
                    nastaviStranskaVrsticaOdprta(!stranskaVrsticaOdprta)
                  }
                >
                  <Nav.Link>{kategorija}</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </Nav>
        </div>
        <main>
          <Container>
            <Routes>
              <Route path="/izdelek/:alt" element={<StranIzdelka />} />
              <Route path="/" element={<DomacaStran />} />
              <Route path="/prijava" element={<PrijavnaStran />} />
              <Route path="/registracija" element={<RegistracijaStran />} />
              <Route path="/dostava" element={<StranDostave />} />
              <Route path="/placilo" element={<StranPlacila />} />
              <Route
                path="/racun"
                element={
                  <ZasciteneUsmeritve>
                    <StranRacuna />
                  </ZasciteneUsmeritve>
                }
              />
              <Route path="/oddajNarocilo" element={<OddajNarociloStran />} />
              <Route
                path="/narocilo/:id"
                element={
                  <ZasciteneUsmeritve>
                    <NarociloStran />
                  </ZasciteneUsmeritve>
                }
              />
              <Route
                path="/narocila"
                element={
                  <ZasciteneUsmeritve>
                    <ZgodovinaNarocil />
                  </ZasciteneUsmeritve>
                }
              />
              <Route path="/isci" element={<IsciStran />} />
              <Route path="/kosarica" element={<StranKosarice />} />
              <Route
                path="/admin/nadzornaPlosca"
                element={
                  <AdminUsmeritev>
                    <NadzornaPloscaStran />
                  </AdminUsmeritev>
                }
              />
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
