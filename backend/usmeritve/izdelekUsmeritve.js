import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Izdelek from '../modeli/izdelekModel.js';
import { jeAdmin, jeAvtoriziran } from '../utils.js';

const izdelekUsmerjevalnik = express.Router();

izdelekUsmerjevalnik.get('/', async (req, res) => {
  const izdelki = await Izdelek.find();
  res.send(izdelki);
});

izdelekUsmerjevalnik.post(
  '/:id/mnenja',
  jeAvtoriziran,
  expressAsyncHandler(async (req, res) => {
    const izdelekId = req.params.id;
    const izdelek = await Izdelek.findById(izdelekId);
    if (izdelek) {
      if (izdelek.mnenja.find((x) => x.ime === req.uporabnik.imeUporabnika)) {
        return res.status(400).send({ message: 'Si ze poslal mnenje' });
      }
      const mnenje = {
        ime: req.uporabnik.imeUporabnika,
        ocena: Number(req.body.ocena),
        komentar: req.body.komentar,
      };
      izdelek.mnenja.push(mnenje);
      izdelek.steviloOcen = izdelek.mnenja.length;
      izdelek.ocena =
        izdelek.mnenja.reduce((a, c) => c.ocena + a, 0) / izdelek.mnenja.length;
      const posodobljenIzdelek = await izdelek.save();
      res.status(201).send({
        message: 'Mnenje kreirano',
        mnenje: posodobljenIzdelek.mnenja[posodobljenIzdelek.mnenja.length - 1],
        steviloOcen: izdelek.steviloOcen,
        ocena: izdelek.ocena,
      });
    } else {
      res.status(404).send({ message: 'Izdelek ni najden' });
    }
  })
);

const PAGE_SIZE = 10;

izdelekUsmerjevalnik.get(
  '/admin',
  jeAvtoriziran,
  jeAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const stran = query.stran || 1;
    const pageSize = query.pageSize || PAGE_SIZE;
    const izdelki = await Izdelek.find()
      .skip(pageSize * (stran - 1))
      .limit(pageSize);
    const steviloIzdelkov = await Izdelek.countDocuments();
    res.send({
      izdelki,
      steviloIzdelkov,
      stran,
      strani: Math.ceil(steviloIzdelkov / pageSize),
    });
  })
);

izdelekUsmerjevalnik.get(
  '/isci',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const stran = query.stran || 1;
    const kategorija = query.kategorija || '';
    const cena = query.cena || '';
    const ocena = query.ocena || '';
    const sortiraj = query.sortiraj || '';
    const poizvedba = query.poizvedba || '';

    const queryFilter =
      poizvedba && poizvedba !== 'vse'
        ? {
            imeIzdelka: {
              $regex: poizvedba,
              $options: 'i',
            },
          }
        : {};
    const categoryFilter =
      kategorija && kategorija !== 'vse'
        ? { kategorijaIzdelka: kategorija }
        : {};
    const ratingFilter =
      ocena && ocena !== 'vse'
        ? {
            ocena: {
              $gte: Number(ocena),
            },
          }
        : {};
    const priceFilter =
      cena && cena !== 'vse'
        ? {
            // 1-50
            cena: {
              $gte: Number(cena.split('-')[0]),
              $lte: Number(cena.split('-')[1]),
            },
          }
        : {};
    const sortOrder =
      sortiraj === 'najnizjaCena'
        ? { cena: 1 }
        : sortiraj === 'najvisjaCena'
        ? { cena: -1 }
        : sortiraj === 'najboljOcenjeno'
        ? { ocena: -1 }
        : sortiraj === 'priporocamo'
        ? { createdAt: -1 }
        : { _id: -1 };

    const izdelki = await Izdelek.find({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (stran - 1))
      .limit(pageSize);

    const steviloIzdelkov = await Izdelek.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    res.send({
      izdelki,
      steviloIzdelkov,
      stran,
      strani: Math.ceil(steviloIzdelkov / pageSize),
    });
  })
);

izdelekUsmerjevalnik.get(
  '/kategorije',
  expressAsyncHandler(async (req, res) => {
    const kategorije = await Izdelek.find().distinct('kategorijaIzdelka');
    res.send(kategorije);
  })
);

izdelekUsmerjevalnik.get('/alt/:alt', async (req, res) => {
  const izdelek = await Izdelek.findOne({ alt: req.params.alt });
  if (izdelek) {
    res.send(izdelek);
  } else {
    res.status(404).send({ message: 'Stran ali izdelek ne obstaja' });
  }
});

izdelekUsmerjevalnik.get('/:id', async (req, res) => {
  const izdelek = await Izdelek.findById(req.params.id);
  if (izdelek) {
    res.send(izdelek);
  } else {
    res.status(404).send({ message: 'Stran ali izdelek ne obstaja' });
  }
});

export default izdelekUsmerjevalnik;
