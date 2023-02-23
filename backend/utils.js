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
