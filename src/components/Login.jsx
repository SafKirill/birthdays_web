import React, { useState, useContext } from "react";
import { SHA256 } from "crypto-js";
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../context/UserContext";
import { Form, Button, Alert } from "react-bootstrap";

import "../style/login.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Logo from "../img/logo.png";

const Login = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const [email, setInputUsername] = useState("");
  const [password, setInputPassword] = useState("");

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [, setToken] = useContext(UserContext);

  const hashString = (str) => {
    return SHA256(str).toString();
  };

  const submitLogin = async () => {
    setLoading(true);
    const userAgent = navigator.userAgent;
    const deviceId = hashString(userAgent);
    try {
      const response = await fetch(apiUrl + "/token", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "password",
          username: email,
          password: password,
          scope: "",
          client_id: deviceId,
          client_secret: "",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setShow(true);
        setErrorText("Неверный логин или пароль.");
      } else {
        const userData = {
          token: data.access_token,
          userId: data.user_id,
          fullName: data.fullname,
        };
        setToken(userData);
      } 
    } catch (error) {
      console.error("Error fetching token:", error);
    }
    setLoading(false);
  };

  const register = () => {
    navigate('/register'); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitLogin();
  };


  return (
    <>
      <div className="sign-in__wrapper">
        {/* Overlay */}
        <div className="sign-in__backdrop"></div>
        {/* Form */}
        <Form className="shadow p-4 bg-white rounded" onSubmit={handleSubmit}>
          {/* Header */}
          <img
            className="img-thumbnail mx-auto d-block mb-2"
            src={Logo}
            alt="logo"
          />
          <div className="h4 mb-4 text-center">Авторизация</div>
          {/* ALert */}
          {show ? (
            <Alert
              className="mb-2"
              variant="danger"
              onClose={() => setShow(false)}
              dismissible
            >
              {errorText}
            </Alert>
          ) : (
            <div />
          )}
          <Form.Group className="mb-2" controlId="username">
            <Form.Label>Почта</Form.Label>
            <Form.Control
              type="text"
              value={email}
              placeholder="Введите логин"
              onChange={(e) => setInputUsername(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-4" controlId="password">
            <Form.Label>Пароль</Form.Label>
            <Form.Control
              type="password"
              value={password}
              placeholder="Введите пароль"
              onChange={(e) => setInputPassword(e.target.value)}
              required
            />
          </Form.Group>
          {!loading ? (
            <Button
              className="w-100"
              variant="primary"
              type="submit"
              style={{ backgroundColor: "#0077ff" }}
            >
              Войти
            </Button>
          ) : (
            <Button
              className="w-100"
              variant="primary"
              type="submit"
              disabled
              style={{ backgroundColor: "#0077ff" }}
            >
              Войти...
            </Button>
          )}
          <div class="container-or mt-3">
            <div class="line"></div>
            <div class="or">ИЛИ</div>
            <div class="line"></div>
          </div>
          {!loading ? (
            <Button
              className="mb-3 mt-3 w-100"
              style={{ backgroundColor: "#4285F4" }}
              id="register"
              onClick={() => register()}
            >
              Зарегистрироваться
            </Button>
          ) : (
            <Button
              className="mb-3 mt-3 w-100"
              style={{ backgroundColor: "#4285F4" }}
              id="register"
              onClick={() => register()}
              disabled
            >
              Зарегистрироваться
            </Button>
          )}
        </Form>
      </div>
    </>
  );
};

export default Login;
