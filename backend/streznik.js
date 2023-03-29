import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedUsmerjevalnik from './usmeritve/seedUsmeritve.js';
import izdelekUsmerjevalnik from './usmeritve/izdelekUsmeritve.js';
import uporabnikUsmerjevalnik from './usmeritve/uporabnikUsmeritve.js';
import narociloUsmerjevalnik from './usmeritve/narociloUsmeritve.js';
import nalaganjeUsmerjevalnik from './usmeritve/nalaganjeUsmeritve.js';

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

app.use('/api/narocila', narociloUsmerjevalnik);

app.use('/api/nalozi', nalaganjeUsmerjevalnik);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/frontend/build')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const vrata = process.env.PORT || 5000;
app.listen(vrata, () => {
  console.log(`streznik upravlja z http://localhost:${vrata}`);
});
