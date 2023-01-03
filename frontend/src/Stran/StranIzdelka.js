import { useParams } from 'react-router-dom';

function StranIzdelka() {
  let params = useParams();
  let { alt } = params;
  return (
    <div>
      <h1>{alt}</h1>
    </div>
  );
}
export default StranIzdelka;
