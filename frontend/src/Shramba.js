import { createContext, useReducer } from 'react';

export const Shramba = createContext();

const prvotnoStanje = {
  podatkiUporabnika: localStorage.getItem('podatkiUporabnika')
    ? JSON.parse(localStorage.getItem('podatkiUporabnika'))
    : null,
  kosarica: {
    izdelkiKosarice: localStorage.getItem('izdelkiKosarice')
      ? JSON.parse(localStorage.getItem('izdelkiKosarice'))
      : [],
    dostava: localStorage.getItem('dostava')
      ? JSON.parse(localStorage.getItem('dostava'))
      : {},
    nacinPlacila: localStorage.getItem('nacinPlacila')
      ? localStorage.getItem('nacinPlacila')
      : '',
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
      localStorage.setItem('izdelkiKosarice', JSON.stringify(izdelkiKosarice));
      return {
        ...stanje,
        kosarica: { ...stanje.kosarica, izdelkiKosarice },
      };
    case 'KOSARICA_IZBRISI_IZDELEK': {
      const izdelkiKosarice = stanje.kosarica.izdelkiKosarice.filter(
        (izdelek) => izdelek._id !== akcija.payload._id
      );
      localStorage.setItem('izdelkiKosarice', JSON.stringify(izdelkiKosarice));
      return { ...stanje, kosarica: { ...stanje.kosarica, izdelkiKosarice } };
    }
    case 'KOSARICA_IZPRAZNI': {
      return {
        ...stanje,
        kosarica: { ...stanje.kosarica, izdelkiKosarice: [] },
      };
    }
    case 'UPORABNIK_PRIJAVA':
      return { ...stanje, podatkiUporabnika: akcija.payload };
    case 'UPORABNIK_ODJAVA':
      return {
        ...stanje,
        podatkiUporabnika: null,
        kosarica: {
          izdelkiKosarice: [],
          dostava: {},
          nacinPlacila: '',
        },
      };
    case 'SHRANI_DOSTAVO':
      return {
        ...stanje,
        kosarica: {
          ...stanje.kosarica,
          dostava: akcija.payload,
        },
      };
    case 'SHRANI_NACIN_PLACILA':
      return {
        ...stanje,
        kosarica: { ...stanje.kosarica, nacinPlacila: akcija.payload },
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
