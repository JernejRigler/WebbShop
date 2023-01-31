import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Ocena from './Ocena';
import axios from 'axios';
import { useContext } from 'react';
import { Shramba } from '../Shramba';
function Izdelek(poslano) {
  const { izdelek } = poslano;
  const { stanje, nalozi: ctxNalozi } = useContext(Shramba);
  const {
    kosarica: { izdelkiKosarice },
  } = stanje;

  const dodajVKosaricoHander = async (izdelek) => {
    const obstajaVKosarici = izdelkiKosarice.find((x) => x._id === izdelek._id);
    const kolicina = obstajaVKosarici ? obstajaVKosarici.kolicina + 1 : 1;
    const { data } = await axios.get(`/api/izdelki/${izdelek._id}`);
    if (data.zaloga < kolicina) {
      window.alert('Izdelek izven zaloge');
      return;
    }

    ctxNalozi({
      tip: 'KOSARICA_DODAJ_IZDELEK',
      payload: { ...izdelek, kolicina },
    });
  };
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
        <Card.Text>{izdelek.cena}€</Card.Text>
        {izdelek.zaloga === 0 ? (
          <Button disabled variant="light">
            Izven zaloge
          </Button>
        ) : (
          <Button onClick={() => dodajVKosaricoHander(izdelek)}>
            V košarico
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}
export default Izdelek;
