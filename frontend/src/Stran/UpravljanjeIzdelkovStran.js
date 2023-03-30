import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router-dom';
import dobiError from '../Errorji';
import Nalaganje from '../Komponente/Nalaganje';
import Sporocilo from '../Komponente/Sporocilo';
import { Shramba } from '../Shramba';
import { LinkContainer } from 'react-router-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
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
    case 'CREATE_REQUEST':
      return { ...stanje, nalaganjeUstvari: true };
    case 'CREATE_SUCCESS':
      return { ...stanje, nalaganjeUstvari: false };
    case 'CREATE_FAIL':
      return { ...stanje, nalaganjeUstvari: false };
    case 'DELETE_REQUEST':
      return { ...stanje, nalaganjeIzbrisi: true, uspesnoIzbrisano: false };
    case 'DELETE_SUCCESS':
      return { ...stanje, nalaganjeIzbrisi: false, uspesnoIzbrisano: true };
    case 'DELETE_FAIL':
      return { ...stanje, nalaganjeIzbrisi: false, uspesnoIzbrisano: false };
    case 'DELETE_RESET':
      return { ...stanje, nalaganjeIzbrisi: false, uspesnoIzbrisano: false };

    default:
      return stanje;
  }
};

export default function UpravljanjeIzdelkovStran() {
  const [
    {
      nalaganje,
      error,
      izdelki,
      strani,
      nalaganjeUstvari,
      nalaganjeIzbrisi,
      uspesnoIzbrisano,
    },
    nalozi,
  ] = useReducer(reducer, {
    nalaganje: true,
    error: '',
  });

  const navigiraj = useNavigate();
  const { search } = useLocation();
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
    if (uspesnoIzbrisano) {
      nalozi({ tip: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [podatkiUporabnika, stran, uspesnoIzbrisano]);

  const ustvariHandler = async () => {
    if (window.confirm('Želite ustvariti nov izdelek?')) {
      try {
        nalozi({ tip: 'CREATE_REQUEST' });
        const { data } = await axios.post(
          '/api/izdelki',
          {},
          { headers: { authorization: `Bearer ${podatkiUporabnika.token}` } }
        );
        alert('Izdelek uspešno ustvarjen');
        nalozi({ tip: 'CREATE_SUCCESS' });
        navigiraj(`/admin/izdelek/${data.izdelek._id}`);
      } catch (err) {
        alert(dobiError(err));
        nalozi({ tip: 'CREATE_FAIL' });
      }
    }
  };
  const izbrisiHandler = async (izdelek) => {
    if (window.confirm('Ste prepričani, da želite izbrisati ta izdelek?')) {
      try {
        nalozi({ tip: 'DELETE_REQUEST' });
        await axios.delete(`/api/izdelki/${izdelek._id}`, {
          headers: { authorization: `Bearer ${podatkiUporabnika.token}` },
        });
        alert('Izdelek uspešno izbrisan');
        nalozi({ tip: 'DELETE_SUCCESS' });
      } catch (err) {
        alert(dobiError(err));
        nalozi({ tip: 'DELETE_FAIL' });
      }
    }
  };
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
                <th>Upravljanje</th>
              </tr>
            </thead>
            <tbody>
              {izdelki.map((izdelek) => (
                <tr key={izdelek._id}>
                  <td>{izdelek._id}</td>
                  <td>{izdelek.imeIzdelka}</td>
                  <td>{izdelek.cena}€</td>
                  <td>{izdelek.kategorijaIzdelka}</td>
                  <td>{izdelek.znamka}</td>
                  <td>
                    <Button
                      type="button"
                      onClick={() => navigiraj(`/admin/izdelek/${izdelek._id}`)}
                    >
                      Uredi
                    </Button>{' '}
                    <Button
                      type="button"
                      onClick={() => izbrisiHandler(izdelek)}
                    >
                      Izbriši
                    </Button>
                  </td>
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
          <Row>
            <Col className="col text-end">
              <div>
                <Button type="button" onClick={ustvariHandler}>
                  Ustvari nov izdelek
                </Button>
              </div>
              {nalaganjeUstvari && <Nalaganje></Nalaganje>}
              {nalaganjeIzbrisi && <Nalaganje></Nalaganje>}
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}
