import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import dobiError from '../Errorji';
import Nalaganje from '../Komponente/Nalaganje';
import Sporocilo from '../Komponente/Sporocilo';
import { Shramba } from '../Shramba';

const reducer = (stanje, akcija) => {
  switch (akcija.tip) {
    case 'FETCH_REQUEST':
      return { ...stanje, nalaganje: true };
    case 'FETCH_SUCCESS':
      return { ...stanje, nalaganje: false };
    case 'FETCH_FAIL':
      return { ...stanje, nalaganje: false, error: akcija.payload };
    case 'UPDATE_REQUEST':
      return { ...stanje, nalaganjePosodobi: true };
    case 'UPDATE_SUCCESS':
      return { ...stanje, nalaganjePosodobi: false };
    case 'UPDATE_FAIL':
      return { ...stanje, nalaganjePosodobi: false };
    case 'UPLOAD_REQUEST':
      return { ...stanje, nalaganjeUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return { ...stanje, nalaganjeUpload: false, errorUpload: '' };
    case 'UPLOAD_FAIL':
      return { ...stanje, nalaganjeUpload: false, errorUpload: akcija.payload };
    default:
      return stanje;
  }
};

export default function UrediIzdelekStran() {
  const { stanje } = useContext(Shramba);
  const { podatkiUporabnika } = stanje;

  const params = useParams();
  const { id: izdelekId } = params;
  const navigiraj = useNavigate();

  const [{ nalaganje, error, nalaganjePosodobi, nalaganjeUpload }, nalozi] =
    useReducer(reducer, {
      nalaganje: true,
      error: '',
    });

  const [imeIzdelka, nastaviImeIzdelka] = useState('');
  const [alt, nastaviAlt] = useState('');
  const [slika, nastaviSliko] = useState('');
  const [znamka, nastaviZnamko] = useState('');
  const [kategorijaIzdelka, nastaviKategorijoIzdelka] = useState('');
  const [opis, nastaviOpis] = useState('');
  const [cena, nastaviCeno] = useState('');
  const [zaloga, nastaviZalogo] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        nalozi({ tip: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/izdelki/${izdelekId}`);
        nastaviImeIzdelka(data.imeIzdelka);
        nastaviAlt(data.alt);
        nastaviSliko(data.slika);
        nastaviZnamko(data.znamka);
        nastaviKategorijoIzdelka(data.kategorijaIzdelka);
        nastaviOpis(data.opis);
        nastaviCeno(data.cena);
        nastaviZalogo(data.zaloga);
        nalozi({ tip: 'FETCH_SUCCESS' });
      } catch (err) {
        nalozi({
          tip: 'FETCH_FAIL',
          payload: dobiError(err),
        });
      }
    };
    fetchData();
  }, [izdelekId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      nalozi({ tip: 'UPDATE_REQUEST' });
      await axios.put(
        `/api/izdelki/${izdelekId}`,
        {
          _id: izdelekId,
          imeIzdelka,
          alt,
          cena,
          slika,
          kategorijaIzdelka,
          znamka,
          zaloga,
          opis,
        },
        {
          headers: {
            authorization: `Bearer ${podatkiUporabnika.token}`,
          },
        }
      );
      nalozi({ tip: 'UPDATE_SUCCESS' });
      alert('Izdelek uspešno posodobljen');
      navigiraj('/admin/nadzorIzdelkov');
    } catch (err) {
      alert(dobiError(err));
      nalozi({ tip: 'UPDATE_FAIL' });
    }
  };

  const naloziDatotekoHandler = async (e) => {
    const datoteka = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', datoteka);
    try {
      nalozi({ tip: 'UPLOAD_REQUEST' });
      const { data } = await axios.post('/api/nalozi', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${podatkiUporabnika.token}`,
        },
      });
      nalozi({ tip: 'UPLOAD_SUCCESS' });
      alert('Slika uspešno naložena');
      nastaviSliko(data.secure_url);
    } catch (err) {
      alert(dobiError(err));
      nalozi({ tip: 'UPLOAD_FAIL', payload: dobiError(err) });
    }
  };
  return (
    <Container className="prijavniObrazec">
      <Helmet>
        <title>Uredi izdelek</title>
      </Helmet>
      <h1 className="my-3">Uredi izdelek {izdelekId}</h1>
      {nalaganje ? (
        <Nalaganje></Nalaganje>
      ) : error ? (
        <Sporocilo tip="danger">{error}</Sporocilo>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="imeIzdelka">
            <Form.Label>Ime</Form.Label>
            <Form.Control
              value={imeIzdelka}
              onChange={(e) => nastaviImeIzdelka(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="alt">
            <Form.Label>Alt</Form.Label>
            <Form.Control
              value={alt}
              onChange={(e) => nastaviAlt(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="slika">
            <Form.Label>Slika - datoteka</Form.Label>
            <Form.Control
              value={slika}
              onChange={(e) => nastaviSliko(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="slikaDatoteka">
            <Form.Label>Naloži datoteko</Form.Label>
            <Form.Control
              type="file"
              onChange={naloziDatotekoHandler}
            ></Form.Control>
            {nalaganjeUpload && <Nalaganje></Nalaganje>}
          </Form.Group>
          <Form.Group className="mb-3" controlId="znamka">
            <Form.Label>Znamka</Form.Label>
            <Form.Control
              value={znamka}
              onChange={(e) => nastaviZnamko(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="kategorijaIzdelka">
            <Form.Label>Kategorija</Form.Label>
            <Form.Control
              value={kategorijaIzdelka}
              onChange={(e) => nastaviKategorijoIzdelka(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="opis">
            <Form.Label>Opis</Form.Label>
            <Form.Control
              value={opis}
              onChange={(e) => nastaviOpis(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="cena">
            <Form.Label>Cena</Form.Label>
            <Form.Control
              value={cena}
              onChange={(e) => nastaviCeno(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="zaloga">
            <Form.Label>Zaloga</Form.Label>
            <Form.Control
              value={zaloga}
              onChange={(e) => nastaviZalogo(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>
          <div className="mb-3">
            <Button disabled={nalaganjePosodobi} type="submit">
              Uredi izdelek
            </Button>
          </div>
          {nalaganjePosodobi && <Nalaganje></Nalaganje>}
        </Form>
      )}
    </Container>
  );
}
