import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./HomePage";
import Register from "./Register";
import Congratulations from "./Congratulations";
import SentСongratulations from "./SentСongratulations";
import Settings from "./Settings";

import "bootstrap/dist/css/bootstrap.min.css";
import "../style/application.css";

const Application = () => {
  return (
    <div className="container-xxl container-top-margin">
      <div className="row h-100">
        <div className="col-12">
          <div className="routes-contend">
            <Routes>
              <Route index element={<HomePage />} />
              <Route path="/register" element={<Register />} />
              <Route path="/congratulations" element={<Congratulations />} />
              <Route path="/sentcongratulations" element={<SentСongratulations />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Application;
