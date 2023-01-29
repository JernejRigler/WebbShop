import { useEffect, useReducer, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logger from 'use-reducer-logger';
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
          izdelki.map((izdelek) => (
            <div className="izdelek" key={izdelek.alt}>
              <Link to={`/izdelek/${izdelek.alt}`}>
                <img src={izdelek.slika} alt={izdelek.imeIzdelka} />
              </Link>
              <div className="imeCena">
                <Link to={`/izdelek/${izdelek.alt}`}>
                  <p>{izdelek.imeIzdelka}</p>
                </Link>
                <p>{izdelek.cena}</p>
                <button>V košarico</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DomacaStran;
