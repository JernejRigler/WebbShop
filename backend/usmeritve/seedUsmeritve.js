import express from 'express';
import Izdelek from '../modeli/izdelekModel.js';
import data from '../data.js';

const seedUsmerjevalnik = express.Router();
seedUsmerjevalnik.get('/', async (req, res) => {
  await Izdelek.remove({});
  const kreiraniIzdelki = await Izdelek.insertMany(data.izdelki);
  res.send({ kreiraniIzdelki });
});
export default seedUsmerjevalnik;
