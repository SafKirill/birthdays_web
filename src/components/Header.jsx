import React, { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import imgGoOutWhite from "../img/goOutWhite.svg";
import imgLogo from "../img/logo.png";

const Header = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [userInfo, setToken] = useContext(UserContext);
  const history = useNavigate();

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

  const shortenName = (Info) => {
    if (Info != null) {
      const fullName = Info.fullName;
      if (fullName != "" && fullName != null) {
        const nameParts = fullName.split(" ");
        const lastName = nameParts[0];
        const initials = nameParts
          .slice(1)
          .map((name) => name.charAt(0) + ".")
          .join("");
        return `${lastName} ${initials}`;
      } else {
        return "";
      }
    } else {
      return "";
    }
  };

  const token = addToken(userInfo);
  const userName = shortenName(userInfo);

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/logout?jwt_token=${token}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: "",
          credentials: "include",
        }
      );

      if (response.ok) {
        const userData = {
          token: "",
          userRole: "",
          fullName: "",
        };
        localStorage.setItem("UserToken", JSON.stringify(userData));
        setToken(null);
        history(`/`);
      }
    } catch (error) {
      console.error("Error fetching token:", error);
    }
  };

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      className="bg-body-tertiary-header .container-max-100w"
    >
      <Container className="container-xxl">
        <Navbar.Brand>
          <img className="logo" src={imgLogo} alt="" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        {token && (
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link>
                <NavLink
                  exact
                  to="/"
                  activeClassName="active"
                  className="nav-link textType-nav-link"
                >
                  Сотрудники
                </NavLink>
              </Nav.Link>
              <Nav.Link>
                <NavLink
                  to="/congratulations"
                  activeClassName="active"
                  className="nav-link textType-nav-link"
                >
                  Мои поздравления
                </NavLink>
              </Nav.Link>
              <Nav.Link>
                <NavLink
                  to="/sentcongratulations"
                  activeClassName="active"
                  className="nav-link textType-nav-link"
                >
                  Отправленные поздравления
                </NavLink>
              </Nav.Link>
              <Nav.Link>
                <NavLink
                  to="/settings"
                  activeClassName="active"
                  className="nav-link textType-nav-link"
                >
                  Настройки
                </NavLink>
              </Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link eventKey={1}>
                <div className="header-user-name textType-nav-link">
                  {userName}
                </div>
              </Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link eventKey={1}>
                <div className="goOutDecstope" id="goOutDecstope">
                  <img src={imgGoOutWhite} alt="" onClick={handleLogout} />
                </div>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        )}
      </Container>
    </Navbar>
  );
};

export default Header;
