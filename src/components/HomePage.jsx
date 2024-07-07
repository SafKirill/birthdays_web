import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../context/UserContext";
import { Button, Table } from "react-bootstrap";
import CongratulationsModal from "./CongratulationsModal";

const HomePage = () => {
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
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleSendCongratulations = (employeeId) => {
    const employee = employees.find((emp) => emp.id === employeeId);
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEmployee(null);
  };

  const fetchEmployees = async () => {
    try {
      const requestOptions = {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await fetch(`${apiUrl}/all_user?name=${search}`, requestOptions);
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
      } else {
        console.error("Ошибка при загрузке сотрудников:", response.statusText);
      }
    } catch (error) {
      console.error("Ошибка при загрузке сотрудников:", error);
    }
  };

  const toggleSubscription = async (followed_id, currentSubscribed) => {
    try {
      let requestOptions = {
        method: "DELETE",
        headers: {
          accept: "application/json",
          Authorization: "Bearer " + token,
        },
      };
      if (currentSubscribed != true) {
        requestOptions.method = "POST";
      }
      const response = await fetch(
        `${apiUrl}/follow?followed_id=${followed_id}`,
        requestOptions
      );

      if (response.ok) {
        const updatedEmployees = employees.map((emp) => {
          if (emp.id === followed_id) {
            return { ...emp, signed: !currentSubscribed };
          }
          return emp;
        });
        setEmployees(updatedEmployees);
      } else {
        console.error("Ошибка при изменении подписки:", response.statusText);
      }
    } catch (error) {
      console.error("Ошибка при изменении подписки:", error);
    }
  };

  const handleSendMessage = async (messageText) => {
    try {
      const receiver_id = selectedEmployee.id;
      const message = messageText;
      const requestBody = {
        receiver_id,
        message,
      };
      const requestOptions = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      };
      const response = await fetch(apiUrl + "/congratulation", requestOptions);

      if (response.ok) {
        window.alert(
          `Поздравление успешно отправлено ${selectedEmployee.fullname}`
        );
        handleCloseModal();
      } else {
        console.error("Ошибка при отправке поздравления:", response.statusText);
      }
    } catch (error) {
      console.error("Ошибка при отправке поздравления:", error);
    }
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  useEffect(() => {
    setEmployees([]);
    fetchEmployees();
  }, [search]);

  return (
    <>
      <div className="container-">
        <div className="row mt-5">
          <div className="col-1"></div>
          <div className="col-10">
            <div className="row">
              <div className="col-9">
                <h2>Список сотрудников</h2>
              </div>
              <div className="col-3">
                <input
                  type="text"
                  placeholder="Поиск сотрудников"
                  value={search}
                  onChange={handleSearchChange}
                  className="form-control"
                />
              </div>
            </div>
            <div className="mt-2 employee-list-container">
              <Table striped bordered hover className="employee-table">
                <thead>
                  <tr>
                    <th className="table-header">ФИО сотрудника</th>
                    <th className="table-header">Дата рождения</th>
                    <th className="table-header">Подписан на рассылку</th>
                    <th className="table-header">Действия</th>
                  </tr>
                </thead>
                <tbody className="employee-table-body">
                  {employees.map((employee) => (
                    <tr key={employee.id}>
                      <td>{employee.fullname}</td>
                      <td>{employee.date_of_birthday}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={employee.signed}
                          onChange={() =>
                            toggleSubscription(employee.id, employee.signed)
                          }
                        />
                      </td>
                      <td>
                        <Button
                          variant="info"
                          onClick={() => handleSendCongratulations(employee.id)}
                        >
                          Отправить поздравление
                        </Button>
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
      {selectedEmployee && (
        <CongratulationsModal
          recipient={selectedEmployee.fullname}
          onHide={handleCloseModal}
          onSend={handleSendMessage}
        />
      )}
    </>
  );
};

export default HomePage;
