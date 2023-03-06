import mongoose from 'mongoose';

const shemaNarocila = new mongoose.Schema(
  {
    izdelkiNarocila: [
      {
        alt: { type: String, required: true },
        imeIzdelka: { type: String, required: true },
        kolicina: { type: Number, required: true },
        slika: { type: String, required: true },
        cena: { type: Number, required: true },
        izdelek: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Izdelek',
          required: true,
        },
      },
    ],
    dostava: {
      ime: { type: String, required: true },
      priimek: { type: String, required: true },
      ulicaHisnaStevilka: { type: String, required: true },
      posta: { type: String, required: true },
      kraj: { type: String, required: true },
    },
    nacinPlacila: { type: String, required: true },
    cenaIzdelkov: { type: Number, required: true },
    cenaDostave: { type: Number, required: true },
    koncnaCena: { type: Number, required: true },
    uporabnik: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Uporabnik',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Narocilo = mongoose.model('Narocilo', shemaNarocila);
export default Narocilo;
