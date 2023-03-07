import jwt from 'jsonwebtoken';

export const generirajToken = (uporabnik) => {
  return jwt.sign(
    {
      _id: uporabnik._id,
      imeUporabnika: uporabnik.imeUporabnika,
      email: uporabnik.email,
      praviceAdmina: uporabnik.praviceAdmina,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );
};

export const jeAvtoriziran = (req, res, next) => {
  const avtorizacija = req.headers.authorization;
  if (avtorizacija) {
    const token = avtorizacija.slice(7, avtorizacija.length);
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Napacen token' });
      } else {
        req.uporabnik = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'Ni tokena' });
  }
};

export const jeAdmin = (req, res, next) => {
  if (req.uporabnik && req.uporabnik.praviceAdmina) {
    next();
  } else {
    res.status(401).send({ message: 'Napaka admin token-a' });
  }
};
