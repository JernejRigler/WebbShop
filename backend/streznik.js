import express from 'express';
import data from './data.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

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
app.get('/api/izdelki', (req, res) => {
  res.send(data.izdelki);
});

app.get('/api/izdelki/alt/:alt', (req, res) => {
  const izdelek = data.izdelki.find((x) => x.alt === req.params.alt);
  if (izdelek) {
    res.send(izdelek);
  } else {
    res.status(404).send({ message: 'Stran ali izdelek ne obstaja' });
  }
});

app.get('/api/izdelki/:id', (req, res) => {
  const izdelek = data.izdelki.find((x) => x._id === req.params.id);
  if (izdelek) {
    res.send(izdelek);
  } else {
    res.status(404).send({ message: 'Stran ali izdelek ne obstaja' });
  }
});

const vrata = process.env.PORT || 5000;
app.listen(vrata, () => {
  console.log(`streznik upravlja z http://localhost:${vrata}`);
});
