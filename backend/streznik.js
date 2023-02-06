import express from 'express';
import data from './data.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedUsmerjevalnik from './usmeritve/seedUsmeritve.js';
import izdelekUsmerjevalnik from './usmeritve/izdelekUsmeritve.js';

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

app.use('/api/seed', seedUsmerjevalnik);

app.use('/api/izdelki', izdelekUsmerjevalnik);

const vrata = process.env.PORT || 5000;
app.listen(vrata, () => {
  console.log(`streznik upravlja z http://localhost:${vrata}`);
});
