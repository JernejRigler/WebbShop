import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import KorakiBlagajne from '../Komponente/KorakiBlagajne';
import Button from 'react-bootstrap/Button';
import { Shramba } from '../Shramba';
import { useNavigate } from 'react-router-dom';
export default function StranPlacila() {
  const { stanje, nalozi: ctxNalozi } = useContext(Shramba);
  const {
    kosarica: { dostava, nacinPlacila },
  } = stanje;

  const [imeNacinPlacila, nastaviNacinPlacila] = useState(
    nacinPlacila || 'placiloPoPovzetju'
  );

  const navigiraj = useNavigate();

  useEffect(() => {
    if (!dostava.ulicaHisnaStevilka) {
      navigiraj('/dostava');
    }
  }, [dostava, navigiraj]);
  const submitHandler = (e) => {
    e.preventDefault();
    console.log(imeNacinPlacila);
    ctxNalozi({ tip: 'SHRANI_NACIN_PLACILA', payload: imeNacinPlacila });
    localStorage.setItem('nacinPlacila', imeNacinPlacila);
    navigiraj('/oddajNarocilo');
  };

  return (
    <div>
      <Helmet>
        <title>Nacin placila</title>
      </Helmet>
      <KorakiBlagajne korak1 korak2 korak3></KorakiBlagajne>
      <h1 className="my-3">Način plačila</h1>
      <Form onSubmit={submitHandler} className="mx-5">
        <div className="mb-3">
          <Form.Check
            type="radio"
            id="placiloPoPovzetju"
            label="Plačilo po povzetju"
            value="placiloPoPovzetju"
            checked={imeNacinPlacila === 'placiloPoPovzetju'}
            onChange={(e) => nastaviNacinPlacila(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <Form.Check
            type="radio"
            id="TRR"
            label="TRR"
            value="TRR"
            checked={imeNacinPlacila === 'TRR'}
            onChange={(e) => nastaviNacinPlacila(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <Button variant="primary" type="submit">
            {'Naslednji korak >'}
          </Button>
        </div>
      </Form>
    </div>
  );
}
