import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import { useNavigate } from 'react-router-dom';

export default function IskalnoPolje() {
  const navigiraj = useNavigate();
  const [poizvedba, nastaviPoizvedbo] = useState('');
  const submitHandler = (e) => {
    e.preventDefault();
    navigiraj(poizvedba ? `/search/?query=${poizvedba}` : '/search');
  };
  const handleClick = (val) => {
    nastaviPoizvedbo('');
  };
  return (
    <Form className="d-flex me-auto" onSubmit={submitHandler}>
      <i class="fa-solid fa-magnifying-glass"></i>
      <InputGroup>
        <InputGroup.Text>
          <i class="fa-solid fa-magnifying-glass"></i>
        </InputGroup.Text>
        <FormControl
          type="text"
          name="p"
          id="p"
          onChange={(e) => nastaviPoizvedbo(e.target.value)}
          placeholder="Iskalni niz"
          aria-label="Iskalni niz"
          aria-describedby="gumb-isci"
          value={poizvedba}
        ></FormControl>
        <Button
          onClick={handleClick}
          className="bg-white text-dark btn-outline-light"
        >
          <i class="fa-solid fa-x"></i>
        </Button>
        <Button variant="secondary" type="submit" id="gumb-isci">
          Išči!
        </Button>
      </InputGroup>
    </Form>
  );
}
