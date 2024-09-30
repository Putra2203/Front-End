import React, { useState, useEffect } from "react";
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
    <div className="container flex items-center justify-center h-screen">
      <div className="flex max-w-screen-xl mx-auto ">
        <div className="flex items-center justify-center p-10 ">
          <form
            onSubmit={Auth}
            className="flex flex-col items-center justify-center gap-4 w-96"
          >
            <h2 className="text-2xl font-semibold underline font-poppins">Login</h2>

            <div className="relative flex items-center gap-2">
              <input
                type="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="p-2 px-8 bg-transparent border border-2 border-black w-72 rounded-3xl"
              />
              <FontAwesomeIcon icon={faUser} className="absolute left-3" />
            </div>

            <div className="relative flex items-center gap-2">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="p-2 px-8 bg-transparent border border-2 border-black w-72 rounded-3xl"
              />
              <FontAwesomeIcon icon={faLock} className="absolute left-3" />
            </div>

            <p className="font-semibold font-poppins">Role</p>
            <div className="flex gap-4">
              <label className="font-normal font-poppins">
                <input
                  type="radio"
                  value="admin"
                  checked={role === "admin"}
                  onChange={() => setRole("admin")}
                  className="mr-2"
                />
                Admin
              </label>
              
              <label className="font-normal font-poppins">
                <input
                  type="radio"
                  value="peserta_magang"
                  checked={role === "peserta_magang"}
                  onChange={() => setRole("peserta_magang")}
                  className="mr-2"
                />
                Peserta Magang
              </label>
            </div>

            <button type="submit" className="p-2 px-4 text-xl text-white bg-black rounded-3xl hover:bg-slate-700">
              Login
            </button>
            {message && <p className="text-red-500">{message}</p>}
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
