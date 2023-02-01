import { useContext } from 'react';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import { Helmet } from 'react-helmet-async';
import { Shramba } from '../Shramba';
import Sporocilo from '../Komponente/Sporocilo';
import { Link, useNavigate } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import axios from 'axios';

export default function StranKosarice() {
  let navigiraj = useNavigate();
  const { stanje, nalozi: ctxNalozi } = useContext(Shramba);
  const {
    kosarica: { izdelkiKosarice },
  } = stanje;

  const posodobiKosaricoHandler = async (izdelek, kolicina) => {
    const { data } = await axios.get(`/api/izdelki/${izdelek._id}`);
    if (data.zaloga < kolicina) {
      window.alert('Izdelek izven zaloge');
      return;
    }

    ctxNalozi({
      tip: 'KOSARICA_DODAJ_IZDELEK',
      payload: { ...izdelek, kolicina },
    });
  };

  const izbrisiIzdelekHandler = (izdelek) => {
    ctxNalozi({ tip: 'KOSARICA_IZBRISI_IZDELEK', payload: izdelek });
  };

  const naBlagajnoHandler = () => {
    navigiraj('/prijava?redirect=/dostava');
  };
  return (
    <div>
      <Helmet>
        <title>Kosarica</title>
      </Helmet>
      <Row>
        <Col md={12}>
          {izdelkiKosarice.length === 0 ? (
            <Sporocilo poslano={'warning'}>
              Trenutno nimate v košarici nobenega izdelka.
              <Link to="/">Nazaj v trgovino</Link>
            </Sporocilo>
          ) : (
            <ListGroup>
              {izdelkiKosarice.map((izdelek) => (
                <ListGroup.Item key={izdelek._id}>
                  <Row className="align-items-center">
                    <Col md={8}>
                      <img
                        src={izdelek.slika}
                        alt={izdelek.imeIzdelka}
                        className="img-fluid rounded img-kosarica"
                      ></img>{' '}
                      <Link to={`/izdelek/${izdelek.alt}`}>
                        {izdelek.imeIzdelka}
                      </Link>
                    </Col>
                    <Col md={2}>
                      <Button
                        variant="light"
                        onClick={() =>
                          posodobiKosaricoHandler(izdelek, izdelek.kolicina - 1)
                        }
                        disabled={izdelek.kolicina === 1}
                      >
                        <i className="fa-solid fa-circle-minus"></i>
                      </Button>{' '}
                      <span className="font-weight-bold">
                        {izdelek.kolicina}
                      </span>
                      <Button
                        variant="light"
                        onClick={() =>
                          posodobiKosaricoHandler(izdelek, izdelek.kolicina + 1)
                        }
                        disabled={izdelek.kolicina === izdelek.zaloga}
                      >
                        <i className="fa-solid fa-circle-plus"></i>
                      </Button>
                    </Col>
                    <Col md={1}>{izdelek.cena} €</Col>
                    <Col md={1}>
                      <Button
                        variant="light"
                        onClick={() => izbrisiIzdelekHandler(izdelek)}
                      >
                        <i className="fa-regular fa-circle-xmark"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Row className="mt-3">
          <Col md={9}>
            <h3>
              Znesek košarice (
              {izdelkiKosarice.reduce((a, c) => a + c.kolicina, 0)} izdelkov):{' '}
              <h2 className="d-inline">
                {izdelkiKosarice
                  .reduce((a, c) => a + c.cena * c.kolicina, 0)
                  .toFixed(2)}{' '}
                €
              </h2>
            </h3>
          </Col>
          <Col md={3}>
            <Button
              type="button"
              variant="dark"
              onClick={naBlagajnoHandler}
              disabled={izdelkiKosarice.length === 0}
            >
              Naslednji korak
            </Button>
          </Col>
        </Row>
      </Row>
    </div>
  );
}
