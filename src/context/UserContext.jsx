import React, { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

export const UserProvider = (props) => {
  const initialToken = (() => {
    const storedToken = localStorage.getItem("UserToken");
    if (storedToken && storedToken !== "null" && storedToken !== "") {
      try {
        return JSON.parse(storedToken);
      } catch (error) {
        console.error("Failed to parse token from localStorage:", error);
        return {
          token: "",
          userId: "",
          fullName: ","
        };
      }
    }
    return {
      token: "",
      userId: "",
      fullName: "",
    };
  })();

  const [token, setToken] = useState(initialToken);

  useEffect(() => {
    const fetchUser = async () => {
      const apiUrl = process.env.REACT_APP_API_URL;
      try {
        if (token && token.token) {
          const requestOptions = {
            method: "GET",
            headers: {
              'accept': 'application/json',
              'Authorization': `Bearer ${token.token}`,
            },
          };

          const response = await fetch(
            apiUrl + "/check_token",
            requestOptions
          );

          if (!response.ok) {
            setToken({
              token: "",
              userId: "",
              fullName: "",
            });
          } else {
            let data = await response.json();
            const userData = {
              token: token.token,
              userId: data.id,
              fullName: data.fullName,
            };
            localStorage.setItem("UserToken", JSON.stringify(userData));
          }
        }
      } catch (error) {
        setToken({
          token: "",
          userId: "",
          fullName: "",
        });
      }
    };

    fetchUser();
  }, [token]);

  return (
    <UserContext.Provider value={[token, setToken]}>
      {props.children}
    </UserContext.Provider>
  );
};
