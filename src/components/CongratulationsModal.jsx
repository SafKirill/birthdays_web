import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const CongratulationsModal = ({ recipient, onHide, onSend }) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    onSend(message);
    onHide();
  };

  return (
    <Modal show={true} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Отправка поздравления</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Получатель: {recipient}</p>
        <Form.Control
          as="textarea"
          placeholder="Введите текст поздравления..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Закрыть
        </Button>
        <Button variant="primary" onClick={handleSendMessage}>
          Отправить
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CongratulationsModal;
