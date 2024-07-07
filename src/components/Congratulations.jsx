import React, { useState, useEffect, useContext } from "react";
import { Table, Modal, Button } from "react-bootstrap";
import { UserContext } from "../context/UserContext";

const Congratulations = () => {
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
  const addId = (Info) => {
    if (Info != null) {
      const Id = Info.userId;
      if (Id != "" && Id != null) {
        return Id;
      } else {
        return "";
      }
    } else {
      return "";
    }
  };
  const token = addToken(userInfo);
  const [congratulations, setCongratulations] = useState([]);
  const [selectedCongratulation, setSelectedCongratulation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  const handleCongratulationClick = async (id, is_read) => {
    try {
      let requestOptions = {};
      let url = `${apiUrl}/congratulation?congratulation_id=${id}`;
      if (is_read) {
        requestOptions = {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
      } else {
        requestOptions = {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
      }

      const response = await fetch(url, requestOptions);

      if (response.ok) {
        const congratulationData = await response.json();
        const updatedCongratulations = congratulations.map((congratulation) =>
          congratulation.id === id
            ? { ...congratulation, is_read: true }
            : congratulation
        );
        setCongratulations(updatedCongratulations);
        setSelectedCongratulation(congratulationData);
        setShowModal(true);
      } else {
        console.error("Ошибка при загрузке данных:", response.statusText);
      }
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalData(null);
  };

  useEffect(() => {
    const fetchCongratulations = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await fetch(
          apiUrl + "/all_congratulation_is_followed",
          requestOptions
        );
        if (response.ok) {
          const data = await response.json();
          setCongratulations(data);
        } else {
          console.error("Ошибка при загрузке данных:", response.statusText);
        }
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    fetchCongratulations();
  }, []);

  return (
    <>
      <div className="container-">
        <div className="row mt-5">
          <div className="col-1"></div>
          <div className="col-10">
            <h2>Список моих поздравлений</h2>
            <div className="mt-2 employee-list-container">
              <Table striped bordered hover className="employee-table">
                <thead>
                  <tr>
                    <th>Дата отправки</th>
                    <th>Отправитель</th>
                    <th>Статус</th>
                  </tr>
                </thead>
                <tbody className="employee-table-body">
                  {congratulations.map((congratulation) => (
                    <tr
                      key={congratulation.id}
                      onClick={() =>
                        handleCongratulationClick(
                          congratulation.id,
                          congratulation.is_read
                        )
                      }
                    >
                      <td>
                        {new Date(congratulation.timestamp).toLocaleString()}
                      </td>
                      <td>{congratulation.sender_name}</td>
                      <td>
                        {congratulation.is_read ? "Прочитано" : "Не прочитано"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
          <div className="col-1"></div>
        </div>
      </div>

      {/* Модальное окно с дополнительной информацией о поздравлении */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Информация о поздравлении</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCongratulation && (
            <div>
              <p>
                <strong>Дата отправки:</strong>{" "}
                {new Date(selectedCongratulation.timestamp).toLocaleString()}
              </p>
              <p>
                <strong>Отправитель:</strong>{" "}
                {selectedCongratulation.sender_name}
              </p>
              <p>
                <strong>Текст поздравления:</strong>{" "}
                {selectedCongratulation.message}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Закрыть
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Congratulations;
