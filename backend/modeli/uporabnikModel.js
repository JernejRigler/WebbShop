import mongoose from 'mongoose';

const shemaUporabnika = new mongoose.Schema(
  {
    imeUporabnika: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    geslo: { type: String, required: true },
    praviceAdmina: { type: Boolean, default: false, required: true },
  },
  {
    timestamps: true,
  }
);

const Uporabnik = mongoose.model('Uporabnik', shemaUporabnika);
export default Uporabnik;
