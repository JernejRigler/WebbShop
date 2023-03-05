function Ocena(poslano) {
  const { ocena, steviloOcen, napis } = poslano;
  return (
    <div className="ocena">
      <span>
        <i
          className={
            ocena >= 1
              ? 'fa-solid fa-star'
              : ocena >= 0.5
              ? 'fa-solid fa-star-half-stroke'
              : 'fa-regular fa-star'
          }
        ></i>
      </span>
      <span>
        <i
          className={
            ocena >= 2
              ? 'fa-solid fa-star'
              : ocena >= 1.5
              ? 'fa-solid fa-star-half-stroke'
              : 'fa-regular fa-star'
          }
        ></i>
      </span>
      <span>
        <i
          className={
            ocena >= 3
              ? 'fa-solid fa-star'
              : ocena >= 2.5
              ? 'fa-solid fa-star-half-stroke'
              : 'fa-regular fa-star'
          }
        ></i>
      </span>
      <span>
        <i
          className={
            ocena >= 4
              ? 'fa-solid fa-star'
              : ocena >= 3.5
              ? 'fa-solid fa-star-half-stroke'
              : 'fa-regular fa-star'
          }
        ></i>
      </span>
      <span>
        <i
          className={
            ocena >= 5
              ? 'fa-solid fa-star'
              : ocena >= 4.5
              ? 'fa-solid fa-star-half-stroke'
              : 'fa-regular fa-star'
          }
        ></i>
      </span>
      {napis ? <span>{napis}</span> : <span>({steviloOcen} ocen)</span>}
    </div>
  );
}
export default Ocena;
