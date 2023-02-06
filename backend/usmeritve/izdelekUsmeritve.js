import express from 'express';
import Izdelek from '../modeli/izdelekModel.js';

const izdelekUsmerjevalnik = express.Router();

izdelekUsmerjevalnik.get('/', async (req, res) => {
  const izdelki = await Izdelek.find();
  res.send(izdelki);
});
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