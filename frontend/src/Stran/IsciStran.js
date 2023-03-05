import axios from 'axios';
import React, { useEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import dobiError from '../Errorji';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Ocena from '../Komponente/Ocena';
import Nalaganje from '../Komponente/Nalaganje';
import Sporocilo from '../Komponente/Sporocilo';
import Button from 'react-bootstrap/Button';
import Izdelek from '../Komponente/Izdelek';
import { LinkContainer } from 'react-router-bootstrap';

const reducer = (stanje, akcija) => {
  switch (akcija.tip) {
    case 'FETCH_REQUEST':
      return { ...stanje, nalaganje: true };
    case 'FETCH_SUCCESS':
      return {
        ...stanje,
        izdelki: akcija.payload.izdelki,
        stran: akcija.payload.stran,
        strani: akcija.payload.strani,
        steviloIzdelkov: akcija.payload.steviloIzdelkov,
        nalaganje: false,
      };
    case 'FETCH_FAIL':
      return { ...stanje, nalaganje: false, error: akcija.payload };

    default:
      return stanje;
  }
};

const cene = [
  {
    ime: '1 € do 100 €',
    vrednost: '1-100',
  },
  {
    ime: '101 € do 500 €',
    vrednost: '101-500',
  },
  {
    ime: '501 € do 1000 €',
    vrednost: '501-1000',
  },
  {
    ime: '1001 € do 2000 €',
    vrednost: '1001-2000',
  },
];

const ocene = [
  {
    ime: 'vsaj 4 zvezdice',
    vrednost: 4,
  },
  {
    ime: 'vsaj 3 zvezdice',
    vrednost: 3,
  },
  {
    ime: 'vsaj 2 zvezdici',
    vrednost: 2,
  },
  {
    ime: 'vsaj 1 zvezdica',
    vrednost: 1,
  },
];

export default function SearchScreen() {
  const navigiraj = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const kategorija = sp.get('kategorija') || 'vse';
  const poizvedba = sp.get('poizvedba') || 'vse';
  const cena = sp.get('cena') || 'vse';
  const ocena = sp.get('ocena') || 'vse';
  const sortiraj = sp.get('sortiraj') || 'priporocamo';
  const stran = sp.get('stran') || 1;

  const [{ nalaganje, error, izdelki, strani, steviloIzdelkov }, nalozi] =
    useReducer(reducer, {
      nalaganje: true,
      error: '',
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `/api/izdelki/isci?stran=${stran}&poizvedba=${poizvedba}&kategorija=${kategorija}&cena=${cena}&ocena=${ocena}&sortiraj=${sortiraj}`
        );
        nalozi({ tip: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        nalozi({
          tip: 'FETCH_FAIL',
          payload: dobiError(err),
        });
      }
    };
    fetchData();
  }, [cena, kategorija, ocena, poizvedba, sortiraj, stran]);

  const [kategorije, nastaviKategorije] = useState([]);
  useEffect(() => {
    const dobiKategorije = async () => {
      try {
        const { data } = await axios.get(`/api/izdelki/kategorije`);
        nastaviKategorije(data);
      } catch (err) {
        alert(dobiError(err));
      }
    };
    dobiKategorije();
  }, [nalozi]);

  const dobiFiltrinanjeUrl = (filter) => {
    const filterStran = filter.stran || stran;
    const filterKategorija = filter.kategorija || kategorija;
    const filterPoizvedba = filter.poizvedba || poizvedba;
    const filterOcena = filter.ocena || ocena;
    const filterCena = filter.cena || cena;
    const sortOrder = filter.sortiraj || sortiraj;
    return `/isci?kategorija=${filterKategorija}&poizvedba=${filterPoizvedba}&cena=${filterCena}&ocena=${filterOcena}&sortiraj=${sortOrder}&stran=${filterStran}`;
  };
  return (
    <div>
      <Helmet>
        <title>Isci izdelke</title>
      </Helmet>
      <Row>
        <Col md={3}>
          <h3>Kategorija</h3>
          <div>
            <ul>
              <li>
                <Link
                  className={'vse' === kategorija ? 'text-bold' : ''}
                  to={dobiFiltrinanjeUrl({ kategorija: 'vse' })}
                >
                  Vse
                </Link>
              </li>
              {kategorije.map((c) => (
                <li key={c}>
                  <Link
                    className={c === kategorija ? 'text-bold' : ''}
                    to={dobiFiltrinanjeUrl({ kategorija: c })}
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Cena</h3>
            <ul>
              <li>
                <Link
                  className={'vse' === cena ? 'text-bold' : ''}
                  to={dobiFiltrinanjeUrl({ cena: 'vse' })}
                >
                  Vse
                </Link>
              </li>
              {cene.map((p) => (
                <li key={p.vrednost}>
                  <Link
                    to={dobiFiltrinanjeUrl({ cena: p.vrednost })}
                    className={p.vrednost === cena ? 'text-bold' : ''}
                  >
                    {p.ime}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Ocene</h3>
            <ul>
              {ocene.map((r) => (
                <li key={r.ime}>
                  <Link
                    to={dobiFiltrinanjeUrl({ ocena: r.vrednost })}
                    className={
                      `${r.vrednost}` === `${ocena}` ? 'text-bold' : ''
                    }
                  >
                    <Ocena napis={'in več'} ocena={r.vrednost}></Ocena>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Col>
        <Col md={9}>
          {nalaganje ? (
            <Nalaganje></Nalaganje>
          ) : error ? (
            <Sporocilo tip="danger">{error}</Sporocilo>
          ) : (
            <>
              <Row className="justify-content-between mb-3">
                <Col md={6}>
                  <div>
                    {steviloIzdelkov === 0 ? 'Ni' : steviloIzdelkov} Zadetkov
                    {poizvedba !== 'vse' && ' : ' + poizvedba}
                    {kategorija !== 'vse' && ' : ' + kategorija}
                    {cena !== 'vse' && ' : Cena ' + cena}
                    {ocena !== 'vse' && ' : Ocena ' + ocena + 'vsaj'}
                    {poizvedba !== 'vse' ||
                    kategorija !== 'vse' ||
                    ocena !== 'vse' ||
                    cena !== 'vse' ? (
                      <Button
                        variant="light"
                        onClick={() => navigiraj('/isci')}
                      >
                        <i className="fas fa-times-circle"></i>
                      </Button>
                    ) : null}
                  </div>
                </Col>
                <Col className="text-end">
                  Sortiraj po{' '}
                  <select
                    value={sortiraj}
                    onChange={(e) => {
                      navigiraj(
                        dobiFiltrinanjeUrl({ sortiraj: e.target.value })
                      );
                    }}
                  >
                    <option value="priporocamo">Priporočamo</option>
                    <option value="najnizjaCena">Najnižja cena naprej</option>
                    <option value="najvisjaCena">Najvišja cena naprej</option>
                    <option value="najboljOcenjeno">
                      Najbolje ocenjeni naprej
                    </option>
                  </select>
                </Col>
              </Row>
              {izdelki.length === 0 && (
                <Sporocilo>Ni bilo najdenih izdelkov</Sporocilo>
              )}

              <Row>
                {izdelki.map((izdelek) => (
                  <Col sm={6} lg={4} className="mb-3" key={izdelek._id}>
                    <Izdelek izdelek={izdelek}></Izdelek>
                  </Col>
                ))}
              </Row>

              <div>
                {[...Array(strani).keys()].map((x) => (
                  <LinkContainer
                    key={x + 1}
                    className="mx-1"
                    to={{
                      pathname: '/isci',
                      search: dobiFiltrinanjeUrl({ stran: x + 1 }).substring(7),
                    }}
                  >
                    <Button
                      className={Number(stran) === x + 1 ? 'text-bold' : ''}
                      variant="light"
                    >
                      {x + 1}
                    </Button>
                  </LinkContainer>
                ))}
              </div>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
}
