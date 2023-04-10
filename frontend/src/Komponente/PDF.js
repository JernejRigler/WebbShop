import React from 'react';
import {
  Page,
  Text,
  Document,
  StyleSheet,
  Font,
  View,
} from '@react-pdf/renderer';

Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
});

const stili = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    fontFamily: 'Roboto',
  },
  izdelki: {
    margin: 5,
    fontSize: 14,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  izdelek: {
    flex: 1,
  },
  tekst: {
    fontSize: 14,
    margin: 3,
  },
  naslov: {
    fontSize: 30,
    marginBottom: 15,
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
  },
  podnaslov: {
    fontSize: 20,
    marginBottom: 5,
    marginTop: 5,
    textAlign: 'left',
    color: 'black',
  },
});

const PDF = (poslano) => {
  const { narocilo, narociloID } = poslano;
  console.log(narocilo);
  console.log(narociloID);
  return (
    <Document>
      <Page style={stili.body}>
        <Text style={stili.naslov} fixed>
          Naročilo {narociloID}
        </Text>
        <Text style={stili.podnaslov}>
          Zahvaljujemo se vam za vaše naročilo pri WebbShop.
        </Text>
        <Text style={stili.podnaslov}>Izdelki:</Text>
        <View style={stili.izdelki}>
          <Text style={stili.izdelek}>Ime izdelka</Text>
          <Text style={stili.izdelek}>Količina</Text>
          <Text style={stili.izdelek}>Cena</Text>
        </View>
        {narocilo.izdelkiNarocila.map((izdelek) => (
          <View style={stili.izdelki}>
            <Text style={stili.izdelek}>{izdelek.imeIzdelka}</Text>
            <Text style={stili.izdelek}>{izdelek.kolicina}</Text>
            <Text style={stili.izdelek}>{izdelek.cena} €</Text>
          </View>
        ))}
        <Text style={stili.podnaslov}>Podatki o dostavi:</Text>
        <Text style={stili.tekst}>
          {narocilo.dostava.ime} {narocilo.dostava.priimek}
        </Text>
        <Text style={stili.tekst}>{narocilo.dostava.ulicaHisnaStevilka}</Text>
        <Text style={stili.tekst}>{narocilo.dostava.kraj}</Text>
        <Text style={stili.podnaslov}>Podatki o plačilu:</Text>
        <Text style={stili.tekst}>
          {narocilo.nacinPlacila === 'placiloPoPovzetju'
            ? 'Plačilo po povzetju'
            : narocilo.nacinPlacila}
        </Text>
        <Text style={stili.podnaslov}>
          Končna cena: {narocilo.koncnaCena.toFixed(2)} €
        </Text>
      </Page>
    </Document>
  );
};

export default PDF;
