import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import Axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Shramba } from '../Shramba';
import dobiError from '../Errorji';

export default function RegistracijaStran() {
  const navigiraj = useNavigate();
  const { search } = useLocation();
  const preusmeriURL = new URLSearchParams(search).get('redirect');
  const preusmeritev = preusmeriURL ? preusmeriURL : '/';

  const [imeUporabnika, nastaviImeUporabnika] = useState('');
  const [email, nastaviEmail] = useState('');
  const [geslo, nastaviGeslo] = useState('');
  const [potrdiGeslo, nastaviPotrdiGeslo] = useState('');

  const { stanje, nalozi: ctxNalozi } = useContext(Shramba);

  const { podatkiUporabnika } = stanje;

  const submitHandler = async (e) => {
    e.preventDefault();
    if (geslo !== potrdiGeslo) {
      alert('Gesli se ne ujemata');
      return;
    }
    try {
      const { data } = await Axios.post('/api/uporabniki/registracija', {
        imeUporabnika,
        email,
        geslo,
      });
      ctxNalozi({ tip: 'UPORABNIK_PRIJAVA', payload: data });
      localStorage.setItem('podatkiUporabnika', JSON.stringify(data));
      navigiraj(preusmeritev || '/');
    } catch (err) {
      alert(dobiError(err));
    }
  };

  useEffect(() => {
    if (podatkiUporabnika) {
      navigiraj(preusmeritev);
    }
  }, [navigiraj, preusmeritev, podatkiUporabnika]);

  return (
    <Container className="prijavniObrazec">
      <Helmet>
        <title>Registracija</title>
      </Helmet>
      <h1 className="my-3">Registrirajte se</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="imeUporabnika">
          <Form.Label>Ime</Form.Label>
          <Form.Control
            required
            onChange={(e) => nastaviImeUporabnika(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>E-poštni naslov</Form.Label>
          <Form.Control
            type="email"
            required
            onChange={(e) => nastaviEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="geslo">
          <Form.Label>Geslo</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => nastaviGeslo(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="potrdiGeslo">
          <Form.Label>Potrdite geslo</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => nastaviPotrdiGeslo(e.target.value)}
          />
        </Form.Group>
        <div className="my-3">
          <Button type="submit">Registriraj me</Button>
        </div>
        <div className="my-3">
          <Link to={`/prijava?redirect=${preusmeritev}`}>Že imate račun?</Link>
        </div>
      </Form>
    </Container>
  );
}
