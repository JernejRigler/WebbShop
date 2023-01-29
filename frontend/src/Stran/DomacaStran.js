import { useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import logger from 'use-reducer-logger';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Izdelek from '../Komponente/Izdelek';
//import data from '../data';

const reducer = (stanje, akcija) => {
  switch (akcija.tip) {
    case 'FETCH_REQUEST':
      return { ...stanje, nalaganje: 1 };
    case 'FETCH_SUCCESS':
      return { ...stanje, izdelki: akcija.payload, nalaganje: 0 };
    case 'FETCH_FAIL':
      return { ...stanje, nalaganje: 0, error: akcija.payload };
    default:
      return stanje;
  }
};

function DomacaStran() {
  const [{ nalaganje, error, izdelki }, nalozi] = useReducer(logger(reducer), {
    izdelki: [],
    nalaganje: 1,
    error: '',
  });
  //const [izdelki, nastaviIzdelke] = useState([]);
  useEffect(() => {
    const dobiPodatke = async () => {
      nalozi({ tip: 'FETCH_REQUEST' });
      try {
        const odgovor = await axios.get('/api/izdelki');
        nalozi({ tip: 'FETCH_SUCCESS', payload: odgovor.data });
      } catch (err) {
        nalozi({ tip: 'FETCH_FAIL', payload: err.message });
      }

      //nastaviIzdelke(odgovor.data);
    };
    dobiPodatke();
  }, []);
  return (
    <div>
      <h1>Priporočeni izdelki</h1>
      <div className="seznamIzdelkov">
        {nalaganje ? (
          <div>Nalaganje...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <Row>
            {izdelki.map((izdelek) => (
              <Col sm={6} md={4} lg={3} className="mb-3">
                <Izdelek izdelek={izdelek}></Izdelek>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}

export default DomacaStran;
