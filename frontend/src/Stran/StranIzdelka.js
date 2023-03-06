import axios from 'axios';
import { useContext, useEffect, useReducer, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Ocena from '../Komponente/Ocena';
import { Link } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import Nalaganje from '../Komponente/Nalaganje';
import Sporocilo from '../Komponente/Sporocilo';
import dobiError from '../Errorji';
import { Shramba } from '../Shramba';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

const reducer = (stanje, akcija) => {
  switch (akcija.tip) {
    case 'FETCH_REQUEST':
      return { ...stanje, nalaganje: 1 };
    case 'FETCH_SUCCESS':
      return { ...stanje, izdelek: akcija.payload, nalaganje: 0 };
    case 'FETCH_FAIL':
      return { ...stanje, nalaganje: 0, error: akcija.payload };
    case 'OSVEZI_IZDELEK':
      return { ...stanje, izdelek: akcija.payload };
    case 'CREATE_REQUEST':
      return { ...stanje, nalaganjeKreiranjeMnenj: true };
    case 'CREATE_SUCCESS':
      return { ...stanje, nalaganjeKreiranjeMnenj: false };
    case 'CREATE_FAIL':
      return { ...stanje, nalaganjeKreiranjeMnenj: false };

    default:
      return stanje;
  }
};

function StranIzdelka() {
  let navigiraj = useNavigate();
  let params = useParams();
  let { alt } = params;

  const [{ nalaganje, error, izdelek, nalaganjeKreiranjeMnenj }, nalozi] =
    useReducer(reducer, {
      izdelek: [],
      nalaganje: 1,
      error: '',
    });
  useEffect(() => {
    const dobiPodatke = async () => {
      nalozi({ tip: 'FETCH_REQUEST' });
      try {
        const odgovor = await axios.get(`/api/izdelki/alt/${alt}`);
        nalozi({ tip: 'FETCH_SUCCESS', payload: odgovor.data });
      } catch (err) {
        nalozi({ tip: 'FETCH_FAIL', payload: dobiError(err) });
      }
    };
    dobiPodatke();
  }, [alt]);

  const { stanje, nalozi: ctxNalozi } = useContext(Shramba);
  const { kosarica, podatkiUporabnika } = stanje;
  const dodajVKosaricoHander = async () => {
    const obstajaVKosarici = kosarica.izdelkiKosarice.find(
      (x) => x._id === izdelek._id
    );
    const kolicina = obstajaVKosarici ? obstajaVKosarici.kolicina + 1 : 1;
    const { data } = await axios.get(`/api/izdelki/${izdelek._id}`);
    if (data.zaloga < kolicina) {
      window.alert('Izdelek izven zaloge');
      return;
    }

    ctxNalozi({
      tip: 'KOSARICA_DODAJ_IZDELEK',
      payload: { ...izdelek, kolicina },
    });
    navigiraj('/kosarica');
  };
  let mnenjaRef = useRef();
  const [ocena, nastaviOceno] = useState(0);
  const [komentar, nastaviKomentar] = useState('');
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!komentar || !ocena) {
      alert('Prosim vnesite komentar in oceno');
      return;
    }
    try {
      const { data } = await axios.post(
        `/api/izdelki/${izdelek._id}/mnenja`,
        { ocena, komentar, ime: podatkiUporabnika.ime },
        {
          headers: {
            authorization: `Bearer ${podatkiUporabnika.token}`,
          },
        }
      );
      nalozi({ tip: 'CREATE_SUCCESS' });
      alert('Mnenje uspešno oddano');
      izdelek.mnenja.unshift(data.mnenje);
      izdelek.steviloOcen = data.steviloOcen;
      izdelek.ocena = data.ocena;
      nalozi({ tip: 'OSVEZI_IZDELEK', payload: izdelek });
      window.scrollTo({
        behavior: 'smooth',
        top: mnenjaRef.current.offsetTop,
      });
    } catch (error) {
      alert(dobiError(error));
      nalozi({ tip: 'CREATE_FAIL' });
    }
  };

  return nalaganje ? (
    <Nalaganje />
  ) : error ? (
    <Sporocilo tip="danger">{error}</Sporocilo>
  ) : (
    <div className="mt-3">
      <Row>
        <Col md={6}>
          <Helmet>
            <title>{izdelek.imeIzdelka}</title>
          </Helmet>
          <Link to="/">
            <i className="fa-solid fa-house"></i>
          </Link>
          <div>Kategorija: {izdelek.kategorijaIzdelka}</div>
          <div className="font-weight-bold">{izdelek.imeIzdelka}</div>
          <Ocena
            ocena={izdelek.ocena}
            steviloOcen={izdelek.steviloOcen}
          ></Ocena>
          <div>Stevilka:{izdelek._id}</div>
          <img
            className="img-large"
            src={izdelek.slika}
            alt={izdelek.imeIzdelka}
          ></img>
        </Col>
        <Col md={6}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <p>{izdelek.opis}</p>
            </ListGroup.Item>
            <ListGroup.Item className="cenaIzdelka">
              {izdelek.cena}€
            </ListGroup.Item>
            <ListGroup.Item className="h3">
              {izdelek.zaloga > 5 ? (
                <Badge bg="success">{'Na zalogi >5'}</Badge>
              ) : izdelek.zaloga <= 5 && izdelek.zaloga > 0 ? (
                <Badge bg="warning" text="dark">
                  Omejena zaloga {izdelek.zaloga}
                </Badge>
              ) : (
                <Badge bg="danger">Ni na zalogi</Badge>
              )}
            </ListGroup.Item>
            {izdelek.zaloga > 0 && (
              <ListGroup.Item>
                <Button onClick={dodajVKosaricoHander} variant="primary">
                  Dodaj v kosarico
                </Button>
              </ListGroup.Item>
            )}
          </ListGroup>
        </Col>
      </Row>
      <div className="my-3">
        <h2 ref={mnenjaRef}>Mnenja kupcev</h2>
        <div className="mb-3">
          {izdelek.mnenja.length === 0 && (
            <Sporocilo tip="warning">Ta izdelek še nima nobene ocene</Sporocilo>
          )}
          {izdelek.mnenja.map((m) => (
            <Card>
              <Card.Body>
                <Card.Text>
                  <strong>{m.ime}</strong> {m.createdAt.substring(0, 10)}
                </Card.Text>
                <Ocena ocena={m.ocena} napis=" "></Ocena>
                <Card.Text>{m.komentar}</Card.Text>
              </Card.Body>
            </Card>
          ))}
          <div className="my-3">
            {podatkiUporabnika ? (
              <>
                <h2>Podajte svoje mnenje:</h2>
                <Form onSubmit={submitHandler}>
                  <Form.Group controlId="ocena" className="mb-3">
                    <Form.Label>Ocena</Form.Label>
                    <Form.Select
                      aria-label="Ocena"
                      value={ocena}
                      onChange={(e) => nastaviOceno(e.target.value)}
                    >
                      <option value="">Izberite...</option>
                      <option value="1">1 - nezadostno</option>
                      <option value="2">2 - zadostno</option>
                      <option value="3">3 - dobro</option>
                      <option value="4">4 - prav dobro.</option>
                      <option value="5">5- odlično</option>
                    </Form.Select>
                  </Form.Group>
                  <FloatingLabel
                    controlId="floatingTextarea"
                    label="Komentar"
                    className="mb-3"
                  >
                    <Form.Control
                      as="textarea"
                      placeholder="Vnesite komentar"
                      value={komentar}
                      onChange={(e) => nastaviKomentar(e.target.value)}
                    />
                  </FloatingLabel>
                  <div className="mb-3">
                    <Button disabled={nalaganjeKreiranjeMnenj} type="submit">
                      Oddaj mnenje
                    </Button>
                    {nalaganjeKreiranjeMnenj && <Nalaganje></Nalaganje>}
                  </div>
                </Form>
              </>
            ) : (
              <Sporocilo>
                Za podajo mnenja se prijavite{' '}
                <Link to={`/prijava/?redirect=/izdelek/${izdelek.alt}`}>
                  tukaj
                </Link>
              </Sporocilo>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default StranIzdelka;
