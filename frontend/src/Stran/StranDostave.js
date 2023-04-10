import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate } from 'react-router-dom';
import { Shramba } from '../Shramba';
import KorakiBlagajne from '../Komponente/KorakiBlagajne';
import postneStevilkeKraji from '../dataKraji';
import Select from 'react-select';

export default function StranDostave() {
  const navigiraj = useNavigate();
  const { stanje, nalozi: ctxNalozi } = useContext(Shramba);

  const {
    podatkiUporabnika,
    kosarica: { dostava },
  } = stanje;

  const [ime, nastaviIme] = useState(dostava.ime || '');
  const [priimek, nastaviPriimek] = useState(dostava.priimek || '');
  const [ulicaHisnaStevilka, nastaviUlicaHisnaStevilka] = useState(
    dostava.ulicaHisnaStevilka || ''
  );
  //const [posta, nastaviPosta] = useState(dostava.posta || '');
  const [kraj, nastaviKraj] = useState(dostava.kraj || '');
  useEffect(() => {
    if (!podatkiUporabnika) {
      navigiraj('/prijava?redirect=/dostava');
    }
  }, [podatkiUporabnika, navigiraj]);
  const submitHandler = (e) => {
    e.preventDefault();
    ctxNalozi({
      tip: 'SHRANI_DOSTAVO',
      payload: {
        ime,
        priimek,
        ulicaHisnaStevilka,
        kraj: kraj.value,
      },
    });
    localStorage.setItem(
      'dostava',
      JSON.stringify({
        ime,
        priimek,
        ulicaHisnaStevilka,
        kraj: kraj.value,
      })
    );
    navigiraj('/placilo');
  };

  return (
    <div>
      <Helmet>
        <title>Dostava</title>
      </Helmet>
      <KorakiBlagajne korak1 korak2></KorakiBlagajne>
      <h1 className="my-3">Informacije o dostavi</h1>
      <Form onSubmit={submitHandler} className="mx-5">
        <Row className="mb-3">
          <Form.Group as={Col} controlId="ime">
            <Form.Label>Ime</Form.Label>
            <Form.Control
              value={ime}
              onChange={(e) => nastaviIme(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group as={Col} controlId="priimek">
            <Form.Label>Priimek</Form.Label>
            <Form.Control
              value={priimek}
              onChange={(e) => nastaviPriimek(e.target.value)}
              required
            />
          </Form.Group>
        </Row>
        <Form.Group className="mb-3" controlId="ulicaHisnaStevilka">
          <Form.Label>Ulica in hišna številka</Form.Label>
          <Form.Control
            value={ulicaHisnaStevilka}
            onChange={(e) => nastaviUlicaHisnaStevilka(e.target.value)}
            required
          />
        </Form.Group>

        {/*
          <Row className="mb-3">
            <Form.Group as={Col} controlId="posta">
              <Form.Label>Poštna številka</Form.Label>
              <Form.Control
                value={posta}
                onChange={(e) => nastaviPosta(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group as={Col} controlId="kraj">
              <Form.Label>Kraj</Form.Label>
              <Form.Control
                value={kraj}
                onChange={(e) => nastaviKraj(e.target.value)}
                required
              />
            </Form.Group>
          </Row>
  */}

        <Row className="mb-3">
          <label id="kraj" htmlFor="kraj">
            Izberi kraj
          </label>
          <Select
            aria-labelledby="kraj"
            inputId="kraj"
            name="kraj"
            options={postneStevilkeKraji}
            onChange={(choice) => nastaviKraj(choice)}
            isSearchable
            defaultValue={{ value: kraj, label: kraj }}
          />
        </Row>
        <div className="mb-3">
          <Button variant="primary" type="submit">
            {'Naslednji korak >'}
          </Button>
        </div>
      </Form>
    </div>
  );
}
