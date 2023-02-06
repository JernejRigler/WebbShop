import mongoose from 'mongoose';

const shemaIzdelka = new mongoose.Schema(
  {
    imeIzdelka: { type: String, required: true, unique: true },
    alt: { type: String, required: true, unique: true },
    slika: { type: String, required: true },
    znamka: { type: String, required: true },
    kategorijaIzdelka: { type: String, required: true },
    opis: { type: String, required: true },
    cena: { type: Number, required: true },
    zaloga: { type: Number, required: true },
    ocena: { type: Number, required: true },
    steviloOcen: { type: Number, required: true },
  },
  {
    timestamp: true,
  }
);

const Izdelek = mongoose.model('Izdelek', shemaIzdelka);
export default Izdelek;
