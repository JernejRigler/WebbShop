import { Link, useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';

export default function PrijavnaStran() {
  const { search } = useLocation();
  const preusmeriURL = new URLSearchParams(search).get('redirect');
  const preusmeritev = preusmeriURL ? preusmeriURL : '/';
  return (
    <Container className="prijavniObrazec">
      <Helmet>
        <title>Prijava</title>
      </Helmet>
      <h1 className="my-3">Prijavite se</h1>
      <Form>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>E-poštni naslov</Form.Label>
          <Form.Control type="email" required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="geslo">
          <Form.Label>Geslo</Form.Label>
          <Form.Control type="password" required />
        </Form.Group>
        <div className="my-3">
          <Button type="submit">Prijavi se</Button>
        </div>
        <div className="my-3">
          <Link to={`/registracija?redirect=${preusmeritev}`}>
            Še nimate računa?
          </Link>
        </div>
      </Form>
    </Container>
  );
}
