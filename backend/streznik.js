import express from 'express';
import data from './data.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedUsmerjevalnik from './usmeritve/seedUsmeritve.js';
import izdelekUsmerjevalnik from './usmeritve/izdelekUsmeritve.js';
import uporabnikUsmerjevalnik from './usmeritve/uporabnikUsmeritve.js';

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('uspesna povezava z bazo');
  })
  .catch((err) => {
    console.log('Napaka' + err.message);
  });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/seed', seedUsmerjevalnik);

app.use('/api/izdelki', izdelekUsmerjevalnik);

app.use('/api/uporabniki', uporabnikUsmerjevalnik);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const vrata = process.env.PORT || 5000;
app.listen(vrata, () => {
  console.log(`streznik upravlja z http://localhost:${vrata}`);
});
