import express from 'express';
import data from './data.js';

const app = express();
app.get('/api/izdelki', (req, res) => {
  res.send(data.izdelki);
});

const vrata = process.env.PORT || 5000;
app.listen(vrata, () => {
  console.log(`streznik upravlja z http://localhost:${vrata}`);
});
