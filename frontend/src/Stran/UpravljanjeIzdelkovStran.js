import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import dobiError from '../Errorji';
import Nalaganje from '../Komponente/Nalaganje';
import Sporocilo from '../Komponente/Sporocilo';
import { Shramba } from '../Shramba';
import { LinkContainer } from 'react-router-bootstrap';
import Button from 'react-bootstrap/Button';

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
        nalaganje: false,
      };
    case 'FETCH_FAIL': {
      return { ...stanje, nalaganje: false, error: akcija.payload };
    }
    default:
      return stanje;
  }
};

export default function UpravljanjeIzdelkovStran() {
  const [{ nalaganje, error, izdelki, strani }, nalozi] = useReducer(reducer, {
    nalaganje: true,
    error: '',
  });

  const { search, pathname } = useLocation();
  const sp = new URLSearchParams(search);
  const stran = sp.get('stran') || 1;

  const { stanje } = useContext(Shramba);
  const { podatkiUporabnika } = stanje;
  useEffect(() => {
    const fetchData = async () => {
      try {
        nalozi({ tip: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/izdelki/admin?stran=${stran}`, {
          headers: { authorization: `Bearer ${podatkiUporabnika.token}` },
        });
        nalozi({ tip: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        nalozi({ tip: 'FETCH_FAIL', payload: dobiError(err) });
      }
    };
    fetchData();
  }, [podatkiUporabnika, stran]);
  return (
    <div>
      <Helmet>
        <title>Upravljanje izdelkov</title>
      </Helmet>
      <h1 className="my-3">Izdelki</h1>
      {nalaganje ? (
        <Nalaganje></Nalaganje>
      ) : error ? (
        <Sporocilo tip="danger">{error}</Sporocilo>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Ime</th>
                <th>Cena</th>
                <th>Kategorija</th>
                <th>Znamka</th>
              </tr>
            </thead>
            <tbody>
              {izdelki.map((izdelek) => (
                <tr key={izdelek._id}>
                  <td>{izdelek._id}</td>
                  <td>{izdelek.imeIzdelka}</td>
                  <td>{izdelek.cena}</td>
                  <td>{izdelek.kategorijaIzdelka}</td>
                  <td>{izdelek.znamka}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            {[...Array(strani).keys()].map((x) => (
              <LinkContainer
                key={x + 1}
                className="mx-1"
                to={{
                  pathname: '/admin/nadzorIzdelkov',
                  search: `stran=${x + 1}`,
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
    </div>
  );
}