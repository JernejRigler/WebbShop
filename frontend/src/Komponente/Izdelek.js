import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Ocena from './Ocena';
function Izdelek(poslano) {
  const { izdelek } = poslano;
  return (
    <Card key={izdelek.alt}>
      <Link to={`/izdelek/${izdelek.alt}`}>
        <img
          src={izdelek.slika}
          className="card-img-top"
          alt={izdelek.imeIzdelka}
        />
      </Link>
      <Card.Body>
        <Link to={`/izdelek/${izdelek.alt}`}>
          <Card.Title>{izdelek.imeIzdelka}</Card.Title>
        </Link>
        <Ocena ocena={izdelek.ocena} steviloOcen={izdelek.steviloOcen}></Ocena>
        <Card.Text>${izdelek.cena}</Card.Text>
        <Button>V košarico</Button>
      </Card.Body>
    </Card>
  );
}
export default Izdelek;
