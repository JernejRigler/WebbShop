import { Link } from 'react-router-dom';
import data from '../data';

function DomacaStran() {
  return (
    <div>
      <h1>Priporočeni izdelki</h1>
      <div className="seznamIzdelkov">
        {data.izdelki.map((izdelek) => (
          <div className="izdelek" key={izdelek.alt}>
            <Link to={`/izdelek/${izdelek.alt}`}>
              <img src={izdelek.slika} alt={izdelek.imeIzdelka} />
            </Link>
            <div className="imeCena">
              <Link to={`/izdelek/${izdelek.alt}`}>
                <p>{izdelek.imeIzdelka}</p>
              </Link>
              <p>{izdelek.cena}</p>
              <button>V košarico</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DomacaStran;
