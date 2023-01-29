import Spinner from 'react-bootstrap/Spinner';

function Nalaganje() {
  return (
    <Spinner animation="border" role="status" variant="dark">
      <span className="visually-hidden">Nalaganje...</span>
    </Spinner>
  );
}
export default Nalaganje;
