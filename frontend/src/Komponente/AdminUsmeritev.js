import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Shramba } from '../Shramba';
export default function AdminUsmeritev({ children }) {
  const { stanje } = useContext(Shramba);
  const { podatkiUporabnika } = stanje;
  return podatkiUporabnika && podatkiUporabnika.praviceAdmina ? (
    children
  ) : (
    <Navigate to="/prijava" />
  );
}
