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
      // add to cart
      return {
        ...stanje,
        kosarica: {
          ...stanje.kosarica,
          izdelkiKosarice: [...stanje.kosarica.izdelkiKosarice, akcija.payload],
        },
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
