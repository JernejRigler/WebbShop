import data from './data';

function App() {
  return (
    <div>
      <header>
        <a id="Naslov" href="\">
          WebbShop
        </a>
      </header>
      <main>
        <h1>Priporočeni izdelki</h1>
        <div className="seznamIzdelkov">
          {data.izdelki.map((izdelek) => (
            <div className="izdelek" key={izdelek.alt}>
              <a href={`/product/${izdelek.alt}`}>
                <img src={izdelek.slika} alt={izdelek.imeIzdelka} />
              </a>
              <div className="imeCena">
                <a href={`/product/${izdelek.alt}`}>
                  <p>{izdelek.imeIzdelka}</p>
                </a>
                <p>{izdelek.cena}</p>
                <button>V košarico</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
