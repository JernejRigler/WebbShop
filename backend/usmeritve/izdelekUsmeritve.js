import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Izdelek from '../modeli/izdelekModel.js';

const izdelekUsmerjevalnik = express.Router();

izdelekUsmerjevalnik.get('/', async (req, res) => {
  const izdelki = await Izdelek.find();
  res.send(izdelki);
});

const PAGE_SIZE = 10;
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
