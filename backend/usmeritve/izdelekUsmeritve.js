import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Izdelek from '../modeli/izdelekModel.js';

const izdelekUsmerjevalnik = express.Router();

izdelekUsmerjevalnik.get('/', async (req, res) => {
  const izdelki = await Izdelek.find();
  res.send(izdelki);
});

const PAGE_SIZE = 3;
izdelekUsmerjevalnik.get(
  '/search',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || '';
    const price = query.price || '';
    const rating = query.rating || '';
    const order = query.order || '';
    const searchQuery = query.query || '';

    const queryFilter =
      searchQuery && searchQuery !== 'all'
        ? {
            imeIzdelka: {
              $regex: searchQuery,
              $options: 'i',
            },
          }
        : {};
    const categoryFilter =
      category && category !== 'all' ? { kategorijaIzdelka: category } : {};
    const ratingFilter =
      rating && rating !== 'all'
        ? {
            ocena: {
              $gte: Number(rating),
            },
          }
        : {};
    const priceFilter =
      price && price !== 'all'
        ? {
            // 1-50
            cena: {
              $gte: Number(price.split('-')[0]),
              $lte: Number(price.split('-')[1]),
            },
          }
        : {};
    const sortOrder =
      order === 'lowest'
        ? { cena: 1 }
        : order === 'highest'
        ? { cena: -1 }
        : order === 'toprated'
        ? { ocena: -1 }
        : order === 'newest'
        ? { createdAt: -1 }
        : { _id: -1 };

    const products = await Izdelek.find({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countProducts = await Izdelek.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
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
