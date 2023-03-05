import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Shramba } from '../Shramba';
export default function ZasciteneUsmeritve({ children }) {
  const { stanje } = useContext(Shramba);
  const { podatkiUporabnika } = stanje;
  return podatkiUporabnika ? children : <Navigate to="/prijava" />;
}
