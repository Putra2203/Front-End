import React, { useState, useEffect } from "react";
import "./login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import image from "../Assets/ImageLogin.png";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    Logout();
  }, []);

  const Auth = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/account/login", {
        username,
        password,
        role,
      });
      role === "admin" ? navigate("/homepage") : navigate("/user/homepage");
    } catch (error) {
      setMessage(
        error.response ? error.response.data.message : "Error occurred"
      );
    }
  };

  const Logout = async () => {
    try {
      await axios.delete("http://localhost:3000/account/logout");
    } catch (error) {
      console.log("Logout failed");
    }
  };

  return (
    <div className="container_logins">
      <div className="wrapper-login">
        <div className="login-container">
          <form onSubmit={Auth} className="login-form">
            <h2 className="login-title poppins-bold">Login</h2>

            <div className="input-group-user">
              <FontAwesomeIcon icon={faUser} className="input-icon-user" />
              <input
                type="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="input-group-pass">
              <FontAwesomeIcon icon={faLock} className="input-icon-pass" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="role-selection">
              <p className="poppins-bold">Role</p>
              <label>
                <input
                  type="radio"
                  value="admin"
                  checked={role === "admin"}
                  onChange={() => setRole("admin")}
                />
                Admin
              </label>
              <label>
                <input
                  type="radio"
                  value="peserta_magang"
                  checked={role === "peserta_magang"}
                  onChange={() => setRole("peserta_magang")}
                />
                Peserta Magang
              </label>
            </div>

            <button type="submit" className="login-button">
              Login
            </button>
            {message && <p className="error-message">{message}</p>}
          </form>
        </div>

        <div className="image-container">
          <img src={image} alt="#" />
        </div>
      </div>
    </div>
  );
};

export default Login;
