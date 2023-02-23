import express from 'express';
import bcrypt from 'bcryptjs';
import Uporabnik from '../modeli/uporabnikModel.js';
import { generirajToken } from '../utils.js';
import expressAsyncHandler from 'express-async-handler';

const uporabnikUsmerjevalnik = express.Router();

uporabnikUsmerjevalnik.post(
  '/prijava',
  expressAsyncHandler(async (req, res) => {
    const uporabnik = await Uporabnik.findOne({ email: req.body.email });
    if (uporabnik) {
      if (bcrypt.compareSync(req.body.geslo, uporabnik.geslo)) {
        res.send({
          _id: uporabnik._id,
          imeUporabnika: uporabnik.imeUporabnika,
          email: uporabnik.email,
          praviceAdmina: uporabnik.praviceAdmina,
          token: generirajToken(uporabnik),
        });
        return;
      }
    }
    res.status(401).send({ message: 'Napacen e-mail ali geslo' });
  })
);

export default uporabnikUsmerjevalnik;
