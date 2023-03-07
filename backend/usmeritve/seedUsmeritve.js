import express from 'express';
import Izdelek from '../modeli/izdelekModel.js';
import data from '../data.js';
import Uporabnik from '../modeli/uporabnikModel.js';
import Narocilo from '../modeli/narociloModel.js';

const seedUsmerjevalnik = express.Router();
seedUsmerjevalnik.get('/', async (req, res) => {
  await Izdelek.remove({});
  const kreiraniIzdelki = await Izdelek.insertMany(data.izdelki);
  await Uporabnik.remove({});
  const kreiraniUporabniki = await Uporabnik.insertMany(data.uporabniki);
  await Narocilo.remove({});
  res.send({ kreiraniIzdelki, kreiraniUporabniki });
});
export default seedUsmerjevalnik;
