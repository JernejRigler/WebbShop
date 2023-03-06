import express from 'express';
import bcrypt from 'bcryptjs';
import Uporabnik from '../modeli/uporabnikModel.js';
import { generirajToken, jeAvtoriziran } from '../utils.js';
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

uporabnikUsmerjevalnik.post(
  '/registracija',
  expressAsyncHandler(async (req, res) => {
    const novUporabnik = new Uporabnik({
      imeUporabnika: req.body.imeUporabnika,
      email: req.body.email,
      geslo: bcrypt.hashSync(req.body.geslo),
    });
    const uporabnik = await novUporabnik.save();
    res.send({
      _id: uporabnik._id,
      imeUporabnika: uporabnik.imeUporabnika,
      email: uporabnik.email,
      praviceAdmina: uporabnik.praviceAdmina,
      token: generirajToken(uporabnik),
    });
  })
);

uporabnikUsmerjevalnik.put(
  '/racun',
  jeAvtoriziran,
  expressAsyncHandler(async (req, res) => {
    const uporabnik = await Uporabnik.findById(req.uporabnik._id);
    if (uporabnik) {
      uporabnik.imeUporabnika =
        req.body.imeUporabnika || uporabnik.imeUporabnika;
      uporabnik.email = req.body.email || uporabnik.email;
      if (req.body.geslo) {
        uporabnik.geslo = bcrypt.hashSync(req.body.geslo, 8);
      }
      const posodobljenUporabnik = await uporabnik.save();
      res.send({
        _id: posodobljenUporabnik._id,
        imeUporabnika: posodobljenUporabnik.imeUporabnika,
        email: posodobljenUporabnik.email,
        praviceAdmina: posodobljenUporabnik.praviceAdmina,
        token: generirajToken(posodobljenUporabnik),
      });
    } else {
      res.status(404).send({ message: 'Uporabnik ni najden' });
    }
  })
);

export default uporabnikUsmerjevalnik;
