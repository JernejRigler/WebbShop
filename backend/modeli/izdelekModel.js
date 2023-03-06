import mongoose from 'mongoose';

const shemaMnenj = new mongoose.Schema(
  {
    ime: { type: String, required: true },
    komentar: { type: String, required: true },
    ocena: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

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
    mnenja: [shemaMnenj],
  },
  {
    timestamps: true,
  }
);

const Izdelek = mongoose.model('Izdelek', shemaIzdelka);
export default Izdelek;
