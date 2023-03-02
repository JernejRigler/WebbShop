import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import Sporocilo from '../Komponente/Sporocilo';
import Nalaganje from '../Komponente/Nalaganje';
import { Shramba } from '../Shramba';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import dobiError from '../Errorji';
import Button from 'react-bootstrap/Button';

const reducer = (stanje, akcija) => {
  switch (akcija.tip) {
    case 'FETCH_REQUEST':
      return { ...stanje, nalaganje: true, error: '' };
    case 'FETCH_SUCCESS':
      return {
        ...stanje,
        narocila: akcija.payload,
        nalaganje: false,
        error: '',
      };
    case 'FETCH_FAIL':
      return { ...stanje, nalaganje: false, error: akcija.payload };
    default:
      return stanje;
  }
};

export default function ZgodovinaNarocil() {
  const { stanje } = useContext(Shramba);
  const { podatkiUporabnika } = stanje;
  const navigiraj = useNavigate();

  const [{ nalaganje, error, narocila }, nalozi] = useReducer(reducer, {
    nalaganje: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      nalozi({ tip: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(`/api/narocila/mojaNarocila`, {
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
        <title>Zgodovina naročil</title>
      </Helmet>
      <h1>Naročila</h1>
      {nalaganje ? (
        <Nalaganje></Nalaganje>
      ) : error ? (
        <Sporocilo tip="danger">{error}</Sporocilo>
      ) : (
        <table className="table">
          <tr>
            <th>Št. naročila</th>
            <th>Cena</th>
            <th>Podrobnosti</th>
          </tr>
          <tbody>
            {narocila.map((narocilo) => (
              <tr key={narocilo._id}>
                <td>{narocilo._id}</td>
                <td>{narocilo.koncnaCena.toFixed(2)} €</td>
                <td>
                  <Button
                    variant="primary"
                    type="button"
                    onClick={() => {
                      navigiraj(`/narocilo/${narocilo._id}`);
                    }}
                  >
                    {'Podrobnosti'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
