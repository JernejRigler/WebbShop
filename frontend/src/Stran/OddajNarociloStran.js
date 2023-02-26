import React, { useContext, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import KorakiBlagajne from '../Komponente/KorakiBlagajne';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import { Link, useNavigate } from 'react-router-dom';
import { Shramba } from '../Shramba';
import ListGroup from 'react-bootstrap/ListGroup';

export default function OddajNarociloStran() {
  const navigiraj = useNavigate();
  const { stanje, nalozi: ctxNalozi } = useContext(Shramba);
  const { kosarica, podatkiUporabnika } = stanje;
  const zaokrozi = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  kosarica.cenaIzdelkov = zaokrozi(
    kosarica.izdelkiKosarice.reduce((a, c) => a + c.kolicina * c.cena, 0)
  );

  kosarica.cenaDostave =
    kosarica.cenaIzdelkov > 250 ? zaokrozi(0) : zaokrozi(5);
  kosarica.koncnaCena = kosarica.cenaIzdelkov + kosarica.cenaDostave;
  const oddajNarociloHandler = async () => {};

  useEffect(() => {
    if (!kosarica.nacinPlacila) {
      navigiraj('/placilo');
    }
  }, [kosarica, navigiraj]);
  return (
    <div>
      <Helmet>
        <title>Naročilo</title>
      </Helmet>
      <KorakiBlagajne korak1 korak2 korak3 korak4></KorakiBlagajne>
      <h1 className="my-3">Vpogled naročila</h1>
      <Row>
        <Col md={12}>
          <Card className="mb-2">
            <Card.Body>
              <Card.Title>Izdelki košarice</Card.Title>
              <ListGroup variant="flush">
                {kosarica.izdelkiKosarice.map((izdelek) => (
                  <ListGroup.Item key={izdelek._id}>
                    <Row className="align-items-center">
                      <Col md={5}>
                        <img
                          src={izdelek.slika}
                          alt={izdelek.imeIzdelka}
                          width="100"
                          className="img-kosarica rounded img-thumbnail img-fluid"
                        ></img>{' '}
                        <Link to={`/izdelek/${izdelek.alt}`}>
                          {izdelek.imeIzdelka}
                        </Link>
                      </Col>
                      <Col md={1}>{izdelek.kolicina}</Col>
                      <Col md={1}>{izdelek.cena}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Link to="/kosarica">Spremeni izdelke košarice</Link>
            </Card.Body>
          </Card>
          <Card className="mb-2">
            <Card.Body>
              <Card.Title>Podatki o dostavi</Card.Title>
              <Card.Text>
                {kosarica.dostava.ime} {kosarica.dostava.priimek}
                <br />
                {kosarica.dostava.ulicaHisnaStevilka}
                <br />
                {kosarica.dostava.posta} {kosarica.dostava.kraj}
                <br />
              </Card.Text>
              <Link to="/dostava">Spremeni podatke dostave</Link>
            </Card.Body>
          </Card>
          <Card className="mb-2">
            <Card.Body>
              <Card.Title>Podatki o plačilu</Card.Title>
              <Card.Text>
                {kosarica.nacinPlacila === 'placiloPoPovzetju'
                  ? 'Plačilo po povzetju'
                  : kosarica.nacinPlacila}
              </Card.Text>
              <Link to="/placilo">Spremeni podatke plačila</Link>
            </Card.Body>
          </Card>
          <Card className="mb-2">
            <Card.Body>
              <Card.Title>Povzetek naročila</Card.Title>
              <Row>
                <Col>Cena izdelkov</Col>
                <Col>{kosarica.cenaIzdelkov.toFixed(2)} €</Col>
              </Row>
              <Row>
                {kosarica.cenaDostave < 5 ? (
                  <span>
                    <Badge bg="success">TOP Ponudba!</Badge>{' '}
                    <span className="text-success">
                      Za nakupe čez 250 € je dostava popolnoma brezplačna!
                    </span>
                  </span>
                ) : (
                  ' '
                )}
                <Col>Cena dostave</Col>
                <Col>{kosarica.cenaDostave.toFixed(2)} €</Col>
              </Row>
              <Row>
                <Col className="text-muted">
                  DDV je že vključen v ceni izdelkov
                </Col>
              </Row>
              <Row className="font-weight-bold">
                <Col>Znesek za plačilo</Col>
                <Col>{kosarica.koncnaCena.toFixed(2)} €</Col>
              </Row>
            </Card.Body>
          </Card>
          <Card className="mb-2 border-0 align-items-center">
            <Card.Body>
              <Button
                type="button"
                onClick={oddajNarociloHandler}
                disabled={kosarica.izdelkiKosarice.length === 0}
              >
                ODDAJ NAROČILO
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
