import React, { useState, useEffect, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import { UserContext } from "../context/UserContext";

const Settings = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
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

  const [daysBeforeReminder, setDaysBeforeReminder] = useState(3);
  const [originalDaysBeforeReminder, setOriginalDaysBeforeReminder] =
    useState(3);
  const [isModified, setIsModified] = useState(false);

  const handleDaysChange = (event) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value >= 0) {
      setDaysBeforeReminder(value);
      setIsModified(value !== originalDaysBeforeReminder);
    }
  };

  const handleApplyChanges = async () => {
    try {
      const requestOptions = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          days_before_birthday_alert: daysBeforeReminder,
        }),
      };
      const response = await fetch(`${apiUrl}/user`, requestOptions);
      if (response.ok) {
        setOriginalDaysBeforeReminder(daysBeforeReminder);
        setIsModified(false);
        window.alert(`Настройки были применены!`);
      } else {
        console.error("Ошибка при обновление настроек:", response.statusText);
      }
    } catch (error) {
      console.error("Ошибка при обновление настроек:", error);
    }
  };

  const getDays = async () => {
    try {
      const requestOptions = {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await fetch(apiUrl + "/user", requestOptions);
      if (response.ok) {
        const data = await response.json();
        setDaysBeforeReminder(data.days_before_birthday_alert);
        setOriginalDaysBeforeReminder(data.days_before_birthday_alert);
      } else {
        console.error("Ошибка при загрузке настроек:", response.statusText);
      }
    } catch (error) {
      console.error("Ошибка при загрузке настроек:", error);
    }
  };

  useEffect(() => {
    getDays();
  }, []);

  return (
    <div className="container">
      <div className="mt-5">
        <h2>Настройки уведомлений о днях рождения коллег</h2>
        <Form>
          <Form.Group controlId="daysBeforeReminder">
            <Form.Label>За сколько дней предупреждать</Form.Label>
            <Form.Control
              type="number"
              min="0"
              value={daysBeforeReminder}
              onChange={handleDaysChange}
            />
            <Form.Text className="text-muted">
              Укажите количество дней, за которое нужно предупреждать о
              предстоящем дне рождения коллеги.
            </Form.Text>
          </Form.Group>

          <Button
            variant="primary"
            onClick={handleApplyChanges}
            disabled={!isModified}
          >
            Применить
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Settings;
