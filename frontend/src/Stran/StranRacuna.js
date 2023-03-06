import React, { useContext, useReducer, useState } from 'react';
import Container from 'react-bootstrap/Container';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Shramba } from '../Shramba';
import { Link } from 'react-router-dom';
import dobiError from '../Errorji';
import axios from 'axios';

const reducer = (stanje, akcija) => {
  switch (akcija.tip) {
    case 'POSODOBITEV_REQUEST':
      return { ...stanje, nalaganjePosodobitve: true };
    case 'POSODOBITEV_SUCCESS':
      return { ...stanje, nalaganjePosodobitve: false };
    case 'POSODOBITEV_FAIL':
      return { ...stanje, nalaganjePosodobitve: false };
    default:
      return stanje;
  }
};

export default function StranRacuna() {
  const { stanje, nalozi: ctxNalozi } = useContext(Shramba);
  const { podatkiUporabnika } = stanje;
  const [imeUporabnika, nastaviImeUporabnika] = useState(
    podatkiUporabnika.imeUporabnika
  );
  const [email, nastaviEmail] = useState(podatkiUporabnika.email);
  const [geslo, nastaviGeslo] = useState('');
  const [potrdiGeslo, nastaviPotrdiGeslo] = useState('');
  const [{ nalaganjePosodobitve }, nalozi] = useReducer(reducer, {
    nalaganjePosodobitve: false,
  });
  const submitHandler = async (e) => {
    e.preventDefault();
    if (geslo !== potrdiGeslo) {
      alert('Passwords do not match');
      return;
    }
    try {
      const { data } = await axios.put(
        '/api/uporabniki/racun',
        {
          imeUporabnika,
          email,
          geslo,
        },
        {
          headers: {
            authorization: `Bearer ${podatkiUporabnika.token}`,
          },
        }
      );
      nalozi({ tip: 'POSODOBITEV_SUCCESS' });
      ctxNalozi({ tip: 'UPORABNIK_PRIJAVA', payload: data });
      localStorage.setItem('podatkiUporabnika', JSON.stringify(data));
      alert('Uporabnik uspešno posodobljen');
    } catch (error) {
      nalozi({ tip: 'POSODOBITEV_FAIL' });
      alert(dobiError(error));
    }
  };
  return (
    <Container className="prijavniObrazec">
      <Helmet>
        <title>Uporabniški račun</title>
      </Helmet>
      <h1 className="my-3">Posodobite uporabniški račun</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="imeUporabnika">
          <Form.Label>Ime</Form.Label>
          <Form.Control
            required
            value={imeUporabnika}
            onChange={(e) => nastaviImeUporabnika(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>E-poštni naslov</Form.Label>
          <Form.Control
            type="email"
            required
            value={email}
            onChange={(e) => nastaviEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="geslo">
          <Form.Label>Geslo</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => nastaviGeslo(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="potrdiGeslo">
          <Form.Label>Potrdite geslo</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => nastaviPotrdiGeslo(e.target.value)}
          />
        </Form.Group>
        <div className="my-3">
          <Button type="submit">Posodobi podatke</Button>
        </div>
      </Form>
    </Container>
  );
}
