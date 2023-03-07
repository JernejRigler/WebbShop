import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import dobiError from '../Errorji';
import Nalaganje from '../Komponente/Nalaganje';
import Sporocilo from '../Komponente/Sporocilo';
import { Shramba } from '../Shramba';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Chart from 'react-google-charts';

const reducer = (stanje, akcija) => {
  switch (akcija.tip) {
    case 'FETCH_REQUEST':
      return { ...stanje, nalaganje: true };
    case 'FETCH_SUCCESS':
      return { ...stanje, povzetek: akcija.payload, nalaganje: false };
    case 'FETCH_FAIL':
      return { ...stanje, error: akcija.payload, nalaganje: false };
    default:
      return stanje;
  }
};

export default function NadzornaPloscaStran() {
  const [{ nalaganje, povzetek, error }, nalozi] = useReducer(reducer, {
    nalaganje: true,
    error: '',
  });
  const { stanje } = useContext(Shramba);
  const { podatkiUporabnika } = stanje;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('/api/narocila/povzetek', {
          headers: {
            authorization: `Bearer ${podatkiUporabnika.token}`,
          },
        });
        nalozi({ tip: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        nalozi({ tip: 'FETCH_FAIL', payload: dobiError(err) });
      }
    };
    fetchData();
  }, [podatkiUporabnika]);
  return (
    <div>
      <Helmet>
        <title>Nadzorna plošča</title>
      </Helmet>
      <h1 className="my-3">Nadzorna plošča</h1>
      {nalaganje ? (
        <Nalaganje></Nalaganje>
      ) : error ? (
        <Sporocilo tip="danger">{error}</Sporocilo>
      ) : (
        <>
          <Row>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {povzetek.uporabniki && povzetek.uporabniki[0]
                      ? povzetek.uporabniki[0].steviloUporabnikov
                      : 0}
                  </Card.Title>
                  <Card.Text>Število uporabnikov</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {povzetek.narocila && povzetek.narocila[0]
                      ? povzetek.narocila[0].steviloNarocil
                      : 0}
                  </Card.Title>
                  <Card.Text>Število naročil</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {povzetek.narocila && povzetek.narocila[0]
                      ? povzetek.narocila[0].skupnaProdaja.toFixed(2)
                      : 0}{' '}
                    €
                  </Card.Title>
                  <Card.Text>Skupna prodaja</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <div>
            <h1 className="my-3">Prodaja skozi čas</h1>
            {povzetek.dnevnaNarocila.length === 0 ? (
              <Sporocilo tip="info">Podatki o prodaji ne obstajajo</Sporocilo>
            ) : (
              <Chart
                width="100%"
                height="450px"
                chartType="AreaChart"
                loader={<div>Pridobivanje podatkov</div>}
                data={[
                  ['Datum', 'Prodaje'],
                  ...povzetek.dnevnaNarocila.map((x) => [x._id, x.prodaja]),
                ]}
              ></Chart>
            )}
          </div>
          <div>
            <h1 className="my-3">Pregled kategorij izdelkov</h1>
            {povzetek.kategorijeIzdelkov.length === 0 ? (
              <Sporocilo tip="info">
                Podatki o kategorijah ne obstajajo
              </Sporocilo>
            ) : (
              <Chart
                width="100%"
                height="450px"
                chartType="PieChart"
                loader={<div>Pridobivanje podatkov</div>}
                data={[
                  ['Kategorija', 'Izdelki'],
                  ...povzetek.kategorijeIzdelkov.map((x) => [x._id, x.stevec]),
                ]}
              ></Chart>
            )}
          </div>
        </>
      )}
    </div>
  );
}
