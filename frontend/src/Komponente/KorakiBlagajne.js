import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function KorakiBlagajne(props) {
  return (
    <Row className="koraki-blagajne">
      <Col className={props.korak1 ? 'opravljen' : ''}>1. Prijava</Col>
      <Col className={props.korak2 ? 'opravljen' : ''}>2. Dostava</Col>
      <Col className={props.korak3 ? 'opravljen' : ''}>3. Plačilo</Col>
      <Col className={props.korak4 ? 'opravljen' : ''}>4. Naročilo</Col>
    </Row>
  );
}
