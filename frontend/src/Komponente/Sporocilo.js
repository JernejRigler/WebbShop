import Alert from 'react-bootstrap/Alert';
function Sporocilo(poslano) {
  return <Alert variant={poslano.tip}>{poslano.children}</Alert>;
}
export default Sporocilo;
