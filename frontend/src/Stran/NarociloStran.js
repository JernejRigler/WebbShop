import React, { useContext, useEffect, useReducer } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Nalaganje from '../Komponente/Nalaganje';
import Sporocilo from '../Komponente/Sporocilo';
import { Shramba } from '../Shramba';
import axios from 'axios';
import dobiError from '../Errorji';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import PDF from '../Komponente/PDF';
import { PDFDownloadLink } from '@react-pdf/renderer';
import Button from 'react-bootstrap/Button';

function reducer(stanje, akcija) {
  switch (akcija.tip) {
    case 'FETCH_REQUEST':
      return { ...stanje, nalaganje: true, error: '' };
    case 'FETCH_SUCCESS':
      return {
        ...stanje,
        narocilo: akcija.payload,
        nalaganje: false,
        error: '',
      };
    case 'FETCH_FAIL':
      return { ...stanje, nalaganje: false, error: akcija.payload };
    default:
      return stanje;
  }
}

export default function NarociloStran() {
  const { stanje } = useContext(Shramba);
  const { podatkiUporabnika } = stanje;

  const parametri = useParams();
  const { id: narociloID } = parametri;
  const navigiraj = useNavigate();

  const [{ nalaganje, error, narocilo }, nalozi] = useReducer(reducer, {
    nalaganje: true,
    error: '',
    narocilo: {},
  });

  useEffect(() => {
    const dobiNarocilo = async () => {
      try {
        nalozi({ tip: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/narocila/${narociloID}`, {
          headers: {
            authorization: `Bearer ${podatkiUporabnika.token}`,
          },
        });
        nalozi({ tip: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        nalozi({ tip: 'FETCH_FAIL', payload: dobiError(err) });
      }
    };
    if (!podatkiUporabnika) {
      return navigiraj('/prijava');
    }
    if (!narocilo._id || (narocilo._id && narocilo._id !== narociloID)) {
      dobiNarocilo();
    }
  }, [narocilo, podatkiUporabnika, narociloID, navigiraj]);

  return nalaganje ? (
    <Nalaganje></Nalaganje>
  ) : error ? (
    <Sporocilo poslano={'warning'}>{error}</Sporocilo>
  ) : (
    <div>
      <Helmet>
        <title>Narocilo {narociloID}</title>
      </Helmet>
      <h1 className="my-3">Naročilo {narociloID}</h1>
      <Row>
        <Col md={12}>
          <Card className="mb-2">
            <Card.Body>
              <Card.Title>Naročeni izdelki</Card.Title>
              <ListGroup variant="flush">
                {narocilo.izdelkiNarocila.map((izdelek) => (
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
                      <Col md={1}>{izdelek.cena} €</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
          <Card className="mb-2">
            <Card.Body>
              <Card.Title>Podatki o dostavi</Card.Title>
              <Card.Text>
                {narocilo.dostava.ime} {narocilo.dostava.priimek}
                <br />
                {narocilo.dostava.ulicaHisnaStevilka}
                <br />
                {narocilo.dostava.kraj}
                <br />
              </Card.Text>
            </Card.Body>
          </Card>
          <Card className="mb-2">
            <Card.Body>
              <Card.Title>Podatki o plačilu</Card.Title>
              <Card.Text>{narocilo.nacinPlacila}</Card.Text>
            </Card.Body>
          </Card>
          <Card className="mb-2">
            <Card.Body>
              <Card.Title>Povzetek naročila</Card.Title>
              <Row>
                <Col>Cena izdelkov</Col>
                <Col>{narocilo.cenaIzdelkov.toFixed(2)} €</Col>
              </Row>
              <Row>
                <Col>Cena dostave</Col>
                <Col>{narocilo.cenaDostave.toFixed(2)} €</Col>
              </Row>
              <Row>
                <Col className="text-muted">
                  DDV je že vključen v ceni izdelkov
                </Col>
              </Row>
              <Row className="font-weight-bold">
                <Col>Končna cena</Col>
                <Col>{narocilo.koncnaCena.toFixed(2)} €</Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <PDFDownloadLink
        document={<PDF narocilo={narocilo} narociloID={narociloID} />}
        filename="Račun"
      >
        <Button type="button">Naloži PDF računa</Button>
      </PDFDownloadLink>
    </div>
  );
}
