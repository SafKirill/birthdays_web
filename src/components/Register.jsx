import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Alert, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Register = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    birthdate: "",
  });

  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fullname = form.name;
      const password = form.password;
      const email = form.email;
      const date_of_birthday = form.birthdate;

      const requestBody = {
        fullname,
        password,
        email,
        date_of_birthday,
      };
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      };

      const response = await fetch(apiUrl + "/user", requestOptions);

      if (response.ok) {
        window.alert(`Регистрация прошла успешно!`); 
      } else {
        const errorData = await response.json();
        console.error("Ошибка регистрации:", errorData.message);
      }
    } catch (error) {
      console.error("Ошибка регистрации:", error);
    }
    console.log(form);
    navigate("/");
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Card className="p-4 shadow-lg">
            <Card.Body>
              <h2 className="text-center mb-4">Регистрация</h2>
              {successMessage && (
                <Alert variant="success">
                  {successMessage}
                </Alert>
              )}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>ФИО</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Введите ваше ФИО"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Почта</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Введите вашу почту"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Пароль</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Введите ваш пароль"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBirthdate">
                  <Form.Label>Дата рождения</Form.Label>
                  <Form.Control
                    type="date"
                    name="birthdate"
                    value={form.birthdate}
                    onChange={handleChange}
                    placeholder="2024-07-06"
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100">
                  Зарегистрироваться
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
