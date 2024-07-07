import React, { useContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Authorization from "./components/Authorization";
import Header from "./components/Header";
import Application from "./components/Applications";

import { UserContext } from "./context/UserContext";

const App = () => {
  const [userInfo] = useContext(UserContext);
  const addToken = (Info) => {
    if (Info != null) {
      const jwt_token = Info.token;
      if (jwt_token != "" && jwt_token != null) {
        return jwt_token;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };
  const token = addToken(userInfo);
  const [tokenLoaded, setTokenLoaded] = useState(false);

  useEffect(() => {
    if (token != "null" && token != null && token != "") {
      setTokenLoaded(true);
    } else {
      setTokenLoaded(false);
    }
  }, [token]);

  return (
    <>
      <Header />
      {!tokenLoaded ? (
        <div className="columns">
          <div className="column"></div>
          <div className="column m-5 is-two-thirds">
            <div className="columns">
              <Authorization />
            </div>
          </div>
          <div className="column"></div>
        </div>
      ) : (
        <Application />
      )}
    </>
  );
};

export default App;
