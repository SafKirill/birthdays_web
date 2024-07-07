import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";

import "bootstrap/dist/css/bootstrap.min.css";
import "../style/application.css";

const Authorization = () => {
  return (
    <div className="container-xxl container-top-margin">
      <div className="row h-100">
        <div className="col-12">
          <div className="routes-contend">
            <Routes>
              <Route index element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authorization;
