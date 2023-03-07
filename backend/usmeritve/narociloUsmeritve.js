import express from 'express';
import Narocilo from '../modeli/narociloModel.js';
import { jeAvtoriziran, jeAdmin } from '../utils.js';
import expressAsyncHandler from 'express-async-handler';
import Izdelek from '../modeli/izdelekModel.js';
import Uporabnik from '../modeli/uporabnikModel.js';

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
  '/povzetek',
  jeAvtoriziran,
  jeAdmin,
  expressAsyncHandler(async (req, res) => {
    const narocila = await Narocilo.aggregate([
      {
        $group: {
          _id: null,
          steviloNarocil: { $sum: 1 },
          skupnaProdaja: { $sum: '$koncnaCena' },
        },
      },
    ]);
    const uporabniki = await Uporabnik.aggregate([
      {
        $group: {
          _id: null,
          steviloUporabnikov: { $sum: 1 },
        },
      },
    ]);
    const dnevnaNarocila = await Narocilo.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%d.%m.%Y', date: '$createdAt' } },
          narocila: { $sum: 1 },
          prodaja: { $sum: '$koncnaCena' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const kategorijeIzdelkov = await Izdelek.aggregate([
      {
        $group: {
          _id: '$kategorijaIzdelka',
          stevec: { $sum: 1 },
        },
      },
    ]);
    res.send({ uporabniki, narocila, dnevnaNarocila, kategorijeIzdelkov });
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
