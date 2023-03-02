import express from 'express';
import Narocilo from '../modeli/narociloModel.js';
import { jeAvtoriziran } from '../utils.js';
import expressAsyncHandler from 'express-async-handler';
import Izdelek from '../modeli/izdelekModel.js';

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
    for (const index in narocilo.izdelkiNarocila) {
      const izdelekNarocila = narocilo.izdelkiNarocila[index];

      const izdelek = await Izdelek.findById(izdelekNarocila.izdelek);

      izdelek.zaloga -= izdelekNarocila.kolicina;

      await izdelek.save();
    }
    res.status(201).send({ message: 'Novo narocilo kreirano', narocilo });
  })
);

narociloUsmerjevalnik.get(
  '/mojaNarocila',
  jeAvtoriziran,
  expressAsyncHandler(async (req, res) => {
    const narocila = await Narocilo.find({ uporabnik: req.uporabnik._id });
    res.send(narocila);
  })
);

narociloUsmerjevalnik.get(
  '/:id',
  jeAvtoriziran,
  expressAsyncHandler(async (req, res) => {
    const narocilo = await Narocilo.findById(req.params.id);
    if (narocilo) {
      res.send(narocilo);
    } else {
      res.status(404).send({ message: 'Narocilo ni najdeno' });
    }
  })
);
export default narociloUsmerjevalnik;
