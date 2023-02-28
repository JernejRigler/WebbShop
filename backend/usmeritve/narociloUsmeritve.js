import express from 'express';
import Narocilo from '../modeli/narociloModel.js';
import { jeAvtoriziran } from '../utils.js';
import expressAsyncHandler from 'express-async-handler';

const narociloUsmerjevalnik = express.Router();
narociloUsmerjevalnik.post(
  '/',
  jeAvtoriziran,
  expressAsyncHandler(async (req, res) => {
    const novoNarocilo = new Narocilo({
      izdelkiNarocila: req.body.izdelkiNarocila.map((x) => ({
        ...x,
        izdelek: x._id,
      })),
      dostava: req.body.dostava,
      nacinPlacila: req.body.nacinPlacila,
      cenaIzdelkov: req.body.cenaIzdelkov,
      cenaDostave: req.body.cenaDostave,
      koncnaCena: req.body.koncnaCena,
      uporabnik: req.uporabnik._id,
    });
    const narocilo = await novoNarocilo.save();
    res.status(201).send({ message: 'Novo narocilo kreirano', narocilo });
  })
);
export default narociloUsmerjevalnik;
