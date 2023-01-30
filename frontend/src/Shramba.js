import { createContext, useReducer } from 'react';

export const Shramba = createContext();

const prvotnoStanje = {
  kosarica: {
    izdelkiKosarice: [],
  },
};
function reducer(stanje, akcija) {
  switch (akcija.tip) {
    case 'KOSARICA_DODAJ_IZDELEK':
      const novIzdelek = akcija.payload;
      const obstajaIzdelek = stanje.kosarica.izdelkiKosarice.find(
        (izdelek) => izdelek._id === novIzdelek._id
      );
      const izdelkiKosarice = obstajaIzdelek
        ? stanje.kosarica.izdelkiKosarice.map((izdelek) =>
            izdelek._id === obstajaIzdelek._id ? novIzdelek : izdelek
          )
        : [...stanje.kosarica.izdelkiKosarice, novIzdelek];
      return {
        ...stanje,
        kosarica: { ...stanje.kosarica, izdelkiKosarice },
      };
    default:
      return stanje;
  }
}

export function PonudnikShrambe(poslano) {
  const [stanje, nalozi] = useReducer(reducer, prvotnoStanje);
  const vrednost = { stanje, nalozi };
  return (
    <Shramba.Provider value={vrednost}>{poslano.children} </Shramba.Provider>
  );
}
