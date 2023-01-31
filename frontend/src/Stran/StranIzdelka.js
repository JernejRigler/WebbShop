import axios from 'axios';
import { useContext, useEffect, useReducer } from 'react';
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

const reducer = (stanje, akcija) => {
  switch (akcija.tip) {
    case 'FETCH_REQUEST':
      return { ...stanje, nalaganje: 1 };
    case 'FETCH_SUCCESS':
      return { ...stanje, izdelek: akcija.payload, nalaganje: 0 };
    case 'FETCH_FAIL':
      return { ...stanje, nalaganje: 0, error: akcija.payload };
    default:
      return stanje;
  }
};

function StranIzdelka() {
  let navigiraj = useNavigate();
  let params = useParams();
  let { alt } = params;

  const [{ nalaganje, error, izdelek }, nalozi] = useReducer(reducer, {
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
  const { kosarica } = stanje;
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
    </div>
  );
}
export default StranIzdelka;
